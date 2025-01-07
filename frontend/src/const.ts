import { ApiResponse } from "./types";

export const DEFAULT_READINGS: ApiResponse[] = [
    {
        "ts": 1736241322343,
        "val": {
            "readings": [
                {
                    "n": "Room1",
                    "r": {
                        "bat": 83,
                        "hum": 61.1,
                        "operating": 1,
                        "pow": 2.868,
                        "tmp": 19.71
                    },
                    "ts": "2025-01-01T18:15:20Z"
                },
                {
                    "n": "Room2",
                    "r": {
                        "bat": 91,
                        "hum": 64.52,
                        "operating": 1,
                        "pow": 2.93,
                        "tmp": 21.24
                    },
                    "ts": "2025-01-01T18:15:20Z"
                },
                {
                    "n": "Room3",
                    "r": {
                        "bat": 20,
                        "hum": 64.11,
                        "operating": 1,
                        "pow": 2.363,
                        "tmp": 20.37
                    },
                    "ts": "2025-01-01T18:15:20Z"
                },
                {
                    "n": "Room4",
                    "r": {
                        "bat": 66,
                        "hum": 57.95,
                        "tmp": 19.7
                    },
                    "ts": "2025-01-01T18:15:20Z"
                },
                {
                    "n": "Room5",
                    "r": {
                        "bat": 87,
                        "hum": 66.95,
                        "tmp": 22.93
                    },
                    "ts": "2025-01-01T18:15:20Z"
                }
            ]
        }
    },
    {
        "ts": 1736239482779,
        "val": {
            "readings": [
                {
                    "n": "Room2",
                    "r": {
                        "bat": 90,
                        "hum": 65.1,
                        "tmp": 19.32
                    },
                    "ts": "2025-01-01T08:44:41Z"
                },
                {
                    "n": "Room1",
                    "r": {
                        "bat": 84,
                        "hum": 61.81,
                        "tmp": 21.84
                    },
                    "ts": "2025-01-01T08:44:41Z"
                },
                {
                    "n": "Room3",
                    "r": {
                        "bat": 15,
                        "hum": 64.81,
                        "operating": 1,
                        "pow": 2.324,
                        "tmp": 20.38
                    },
                    "ts": "2025-01-01T08:44:41Z"
                },
                {
                    "n": "Room4",
                    "r": {
                        "bat": 67,
                        "hum": 60.47,
                        "operating": 1,
                        "pow": 2.741,
                        "tmp": 18.78
                    },
                    "ts": "2025-01-01T08:44:41Z"
                },
                {
                    "n": "Room5",
                    "r": {
                        "bat": 87,
                        "hum": 66.42,
                        "operating": 1,
                        "pow": 2.899,
                        "tmp": 22.95
                    },
                    "ts": "2025-01-01T08:44:41Z"
                }
            ]
        }
    }
];