function ExamplePage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center p-4">
            <h1 className="text-2xl font-bold">BLE Sensor Dashboard</h1>
            <p className="text-center mt-2 text-gray-600">
                Add token, user, bucket, and mappings via URL parameters to start.
            </p>
            <p className="mt-2 text-gray-600 text-sm">
                Example URL:
                <br />
                <code className="text-sm bg-gray-100 p-1 rounded">
                    ?token=YOUR_TOKEN&user=YOUR_USER&bucket=YOUR_BUCKET&mappings=Sensor_0:Room1;Sensor_1:Room2
                </code>
            </p>
        </div>
    );
}

export { ExamplePage }