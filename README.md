# Odyssey - Code Like A Bosch 🧑‍💻

<br/>

## The Challange 🎯

Your task for the upcoming 24 hours will include implementing a solution for vehicle collision avoidance as well thinking like an innovator and delivering the next generation of driver assistance systems. Join us on this exciting challenge!

<br/>

## How It Works 🚀

1. **Clone the Repository**: Start by cloning the Triolapse repository.
```json
{
  "33.24150366": {
    "timestamp": 33.24150366,
    "deltatime": 0.0,
    "vehicle": {
      "yaw": 0.0,
      "speed": 0.0,
      "rotation": 0.0
    },
    "objects": [
      {
        "distance": {
          "x": 8211.0,
          "y": 1444.0
        },
        "speed": {
          "x": -2.0,
          "y": 0.0
        }
      }
    ]
  }
}

```
2. **Connection request**: The client sends a connection request, to which the server responds with the properties of the data set.
```tsx
    const webSocket = new ReconnectingWebSocket("ws://localhost:8765");

    webSocket.onopen = () => {
      const connectionRequest = { type: "connection" } as RequestType;
      const connectionString = JSON.stringify(connectionRequest);
      webSocket.send(connectionString);
    };
```
3. **Data request**: Every time the slider on the website changes, a data request is sent to the server, to which the server responds with the timestamped data.
```tsx
const request = useMemo(() => ({ type, timestamp }), [type, timestamp]);

useEffect(() => {
  socket && socket.send(JSON.stringify(request));
}, [socket, request]);
```
4. **Visualization**: Everything is displayed in real time using Threejs in a browser accessible to everyone. [Try it now.](https://markdownlivepreview.com/)

<br/>

## Run It Yourself 🏃‍♂️

1. **Clone the Repository**: Start by cloning the Triolapse repository. To run it locally, you will need `node` and `python`
```bash
git clone https://github.com/danielbacsur/bosch
cd bosch
```
2. **Run the Program**: Install dependencies and start the dev server.
```bash
npm install
npm run dev
```
3. **Enjoy**: All dependencies will be installed automatically. That's it. Cool isn't it? 🔥

<br/>

## Thanks ❤️
Special thanks to Karol Miklas for the amazing Porsche 911 model.
```
Author: Karol Miklas (https://sketchfab.com/karolmiklas)
License: CC-BY-SA-4.0 (http://creativecommons.org/licenses/by-sa/4.0/)
Source: https://sketchfab.com/3d-models/free-porsche-911-carrera-4s-d01b254483794de3819786d93e0e1ebf
Title: (FREE) Porsche 911 Carrera 4S
```
