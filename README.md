# WebRTC Signaling Server 

A lightweight Node.js & Socket.io server that acts as the "matchmaker" for peer-to-peer video chat. It handles room management and relays WebRTC handshake data (SDP/ICE) and chat messages between clients.

## Tech Stack

* **Runtime:** Node.js
* **Framework:** Express
* **Real-time:** Socket.io
* **Security:** CORS (enabled for all origins)


## Socket Events API

| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `join-room` | Client → Server | `roomId` (String) | User requests to join a specific room. |
| `room-created` | Server → Client | - | Emitted to the **first** user (Host) indicating they are waiting. |
| `room-joined` | Server → Client | - | Emitted to the room when the **second** user joins, triggering the call. |
| `full-room` | Server → Client | - | Emitted if a 3rd user attempts to join an active room. |
| `offer` | Bidirectional | `{ roomId, sdp }` | Relays the WebRTC Offer (session description). |
| `answer` | Bidirectional | `{ roomId, sdp }` | Relays the WebRTC Answer (session description). |
| `ice-candidate` | Bidirectional | `{ roomId, candidate }` | Relays Network/ICE Candidates for connectivity. |
| `chat-message` | Bidirectional | `{ roomId, text }` | Relays text chat messages between peers. |

- This must be deployed for the videochat website to work.