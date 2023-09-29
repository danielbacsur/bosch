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
        "vehicle": {"yaw": row["YawRate"], "speed": row["VehicleSpeed"]},
        "objects": [
            {
                "distance": {
                    "x": row[f"{name}ObjectDistance_X"],
                    "y": row[f"{name}ObjectDistance_Y"],
                },
                "speed": {
                    "x": row[f"{name}ObjectSpeed_X"],
                    "y": row[f"{name}ObjectSpeed_Y"],
                },
            }
            for name in ["First", "Second", "Third", "Fourth"]
        ],
    }

# Calculate the delta time of the database, and get some helper variables
minkey = min(structured.keys())
maxkey = max(structured.keys())
length = len(structured)
deltat = maxkey - minkey

print("length", length)
print("deltat", deltat)


#########################################################################


# Main callback for WebSocket connection
async def main(websocket, path):
    async for message in websocket:
        pass


# Start WebSocket server
server = websockets.serve(main, "localhost", 8765)
asyncio.get_event_loop().run_until_complete(server)
asyncio.get_event_loop().run_forever()
