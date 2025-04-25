import React from 'react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">🌐 AURA – IoT ↔ AO Routing Framework</h1>
      <p className="mb-4">
        AURA is a real-time routing framework that connects your IoT devices to the Arweave AO compute network. It enables <strong>two-way communication</strong> between your devices and decentralized processes, allowing you to send data to AO and receive intelligent responses back — effortlessly.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">⚙️ MQTT Configuration</h2>
      <ul className="list-disc list-inside mb-4">
        <li><strong>Broker IP:</strong> <code>57.128.58.120</code></li>
        <li><strong>Port:</strong> <code>1883</code></li>
        <li><strong>Publish Topic:</strong> <code>root/main</code></li>
        <li><strong>Subscribe Topic:</strong> your choice (set using <code>&quot;where-to-find-me&quot;</code> field)</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-2">💬 Message Format (IoT → AO)</h2>
      <p className="mb-4">Your IoT device should publish a message to topic <code>root/main</code> with the following structure:</p>
      <pre className="bg-gray-100 p-4 rounded mb-4">
        <code>
{`{
  "ao-processes": "PROCESS_ID_1,PROCESS_ID_2",
  "data": "your payload or sensor data",
  "where-to-find-me": "your/device/response/topic"
}`}
        </code>
      </pre>

      <h2 className="text-2xl font-semibold mt-8 mb-2">🔁 How AURA Works (Bidirectional Flow)</h2>
      <ol className="list-decimal list-inside mb-4">
        <li>IoT device sends a message to <code>root/main</code> with the required fields.</li>
        <li>AURA Express server receives it and forwards it to the deployed AO Mother Process.</li>
        <li>The Mother Process routes the message to each AO process specified in <code>ao-processes</code>.</li>
        <li>AO process handles the message and replies with its output.</li>
        <li>AURA server picks up the AO response and publishes it back to the topic given in <code>where-to-find-me</code>.</li>
        <li>Your device, subscribed to <code>where-to-find-me</code>, receives the AO result in real time.</li>
      </ol>

      <h2 className="text-2xl font-semibold mt-8 mb-2">📬 Full Example</h2>
      <p className="mb-4">Device publishes:</p>
      <pre className="bg-gray-100 p-4 rounded mb-4">
        <code>
{`{
  "ao-processes": "a1b2c3d4e5",
  "data": "temperature=28.7",
  "where-to-find-me": "esp32/sensor/response"
}`}
        </code>
      </pre>

      <p className="mb-4">AO Process receives:</p>
      <pre className="bg-gray-100 p-4 rounded mb-4">
        <code>
{`-- Sample AO process
Handlers.add("from-iot", { Action = "IoT-Message" }, function(msg)
  print("Received from IoT: " .. tostring(msg.Data))

  msg:reply({
    Tags = {
      ["Target-MQTT-Channel"] = msg.Tags["Response-Topic"]
    },
    Data = "Activate fan"
  })
end)

return { Output = { data = "ready" } }`}
        </code>
      </pre>

      <p className="mb-4">Device receives (on <code>esp32/sensor/response</code>):</p>
      <pre className="bg-gray-100 p-4 rounded mb-4">
        <code>
{`{
  "status": "ok",
  "message": "Activate fan"
}`}
        </code>
      </pre>

      <h2 className="text-2xl font-semibold mt-8 mb-2">🧠 AO Lua Process Template</h2>
      <pre className="bg-gray-100 p-4 rounded mb-4">
        <code>
{`Handlers.add("from-iot", { Action = "IoT-Message" }, function(msg)
  print("Received from IoT: " .. tostring(msg.Data))

  msg:reply({
    Tags = {
      ["Target-MQTT-Channel"] = msg.Tags["Response-Topic"]
    },
    Data = "Processed: " .. tostring(msg.Data)
  })
end)

return { Output = { data = "ready" } }`}
        </code>
      </pre>

      <h2 className="text-2xl font-semibold mt-8 mb-2">📌 Recap</h2>
      <table className="table-auto border-collapse border border-gray-400 w-full mb-4">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-2">Direction</th>
            <th className="border border-gray-400 px-4 py-2">Action</th>
            <th className="border border-gray-400 px-4 py-2">Protocol</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-400 px-4 py-2">IoT → AO</td>
            <td className="border border-gray-400 px-4 py-2">Publish JSON to <code>root/main</code></td>
            <td className="border border-gray-400 px-4 py-2">MQTT</td>
          </tr>
          <tr>
            <td className="border border-gray-400 px-4 py-2">AO → IoT</td>
            <td className="border border-gray-400 px-4 py-2">AO process replies → Server routes via MQTT</td>
            <td className="border border-gray-400 px-4 py-2">MQTT</td>
          </tr>
          <tr>
            <td className="border border-gray-400 px-4 py-2">Device receives</td>
            <td className="border border-gray-400 px-4 py-2">On the topic given in <code>where-to-find-me</code></td>
            <td className="border border-gray-400 px-4 py-2">MQTT</td>
          </tr>
        </tbody>
      </table>

      <h2 className="text-2xl font-semibold mt-8 mb-2">🛠 Deployment Status</h2>
      <ul className="list-disc list-inside mb-4">
        <li>✅ Express routing server: Deployed</li>
        <li>✅ AO Mother Process: Deployed</li>
        <li>✅ MQTT Broker: Live at <code>57.128.58.120:1883</code></li>
      </ul>

      <p className="mb-4">You only need to:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Connect your IoT device to the broker</li>
        <li>Format your messages correctly</li>
        <li>Handle responses on your device</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-2">🤝 Credits</h2>
      <p className="mb-4">Built with ❤️ by the AURA Team</p>
      <p className="mb-4">Powered by: MQTT • Arweave AO • Node.js • Lua</p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">🧪 Coming Soon</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Dashboards for monitoring</li>
        <li>Templates for ESP32/Arduino</li>
        <li>Live process registration</li>
      </ul>

      <p className="mb-4">Stay tuned!</p>
    </div>
  );
}
