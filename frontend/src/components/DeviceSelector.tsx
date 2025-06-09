import React from 'react';

interface DeviceSelectorProps {
    devices: string[];
    selectedDevices: string[];
    onChange: (selectedDevices: string[]) => void;
    mappings: Record<string, string>;
    colorMap: Record<string, string>;
    className?: string;
}

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
    devices,
    selectedDevices,
    onChange,
    mappings,
    colorMap,
    className = ""
}) => {
    const handleSelectAll = () => onChange(devices);
    const handleDeselectAll = () => onChange([]);

    const handleDeviceToggle = (device: string, checked: boolean) => {
        onChange(
            checked
                ? [...selectedDevices, device]
                : selectedDevices.filter(d => d !== device)
        );
    };

    return (
        <div className={`border-t border-gray-300 dark:border-gray-600 pt-4 ${className}`}>
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Devices</span>
                    <span>
                        <button
                            onClick={handleSelectAll}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline mr-2"
                        >
                            Select All
                        </button>
                        <button
                            onClick={handleDeselectAll}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            Deselect All
                        </button>
                    </span>
                </div>
                <div className="flex flex-wrap gap-3">
                    {devices.map((device) => (
                        <label
                            key={device}
                            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                        >
                            <input
                                type="checkbox"
                                checked={selectedDevices.includes(device)}
                                onChange={(e) => handleDeviceToggle(device, e.target.checked)}
                                className="rounded border-gray-300"
                            />
                            <span style={{ color: colorMap[device] }}>
                                {mappings[device] || device}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};