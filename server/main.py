import pandas as pd
import websockets
import asyncio
import json


# Read the CSV file considering the first column as the index
df = pd.read_csv("database.csv", index_col=0)

structured = {}

# Restructure the database records
for index, row in df.iterrows():
    timestamp = row["Timestamp"]
    structured[timestamp] = {
        "timestamp": row["Timestamp"],
        "vehicle": {
            "yaw": row["YawRate"],
            "speed": float(row["VehicleSpeed"]) / 256,
        },
        "objects": [
            {
                "distance": {
                    "x": float(row[f"{name}ObjectDistance_Y"]) / 128,
                    "y": float(row[f"{name}ObjectDistance_X"]) / 128,
                },
                "speed": {
                    "x": float(row[f"{name}ObjectSpeed_Y"]) / 256,
                    "y": float(row[f"{name}ObjectSpeed_X"]) / 256,
                },
            }
            for name in ["First", "Second", "Third", "Fourth"]
        ],
    }

sorted = sorted(structured.keys())
previous = sorted[0]
totalRotation = 0

# Calculate additive variables
for current in sorted:
    deltatime = current - previous
    structured[current]["deltatime"] = deltatime

    totalRotation += deltatime * structured[current]["vehicle"]["yaw"]
    structured[current]["vehicle"]["rotation"] = totalRotation

    previous = current


# Calculate the delta time of the database, and get some helper variables
minkey = min(structured.keys())
maxkey = max(structured.keys())
length = len(structured)
deltat = maxkey - minkey


# Return the value that corresponds to the closest key to the slider's value
def search(slider_val):
    closest_key = min(structured.keys(), key=lambda k: abs(k - slider_val))
    return structured[closest_key]


# Main callback for WebSocket connection
async def main(websocket, path):
    async for message in websocket:
        request = json.loads(message)

        request_type = str(request["type"])

        if request_type == "connection":
            response = {
                "type": "connection",
                "data": {
                    "minkey": minkey,
                    "maxkey": maxkey,
                    "length": length,
                    "deltat": deltat,
                },
            }
            await websocket.send(json.dumps(response))
        elif request_type == "data":
            request_timestamp = float(request["timestamp"])
            response = {
                "type": "data",
                "data": search(request_timestamp),
            }
            await websocket.send(json.dumps(response))


# Start WebSocket server
server = websockets.serve(main, "localhost", 8765)
asyncio.get_event_loop().run_until_complete(server)
asyncio.get_event_loop().run_forever()
