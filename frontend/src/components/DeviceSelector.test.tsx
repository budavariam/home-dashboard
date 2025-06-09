import { render, screen, fireEvent } from '@testing-library/react';
import { DeviceSelector } from './DeviceSelector';
import { createMockMappings, createMockColorMap } from '../test-utils';

describe('DeviceSelector', () => {
    const mockDevices = ['device001', 'device002', 'device003'];
    const mockMappings = createMockMappings(mockDevices);
    const mockColorMap = createMockColorMap(mockDevices);

    it('renders all devices', () => {
        const mockOnChange = jest.fn();
        render(
            <DeviceSelector
                devices={mockDevices}
                selectedDevices={[]}
                onChange={mockOnChange}
                mappings={mockMappings}
                colorMap={mockColorMap}
            />
        );

        expect(screen.getByText('Living Room Sensor')).toBeInTheDocument();
        expect(screen.getByText('Kitchen Sensor')).toBeInTheDocument();
        expect(screen.getByText('Bedroom Sensor')).toBeInTheDocument();
    });

    it('shows correct selection state', () => {
        const mockOnChange = jest.fn();
        render(
            <DeviceSelector
                devices={mockDevices}
                selectedDevices={['device001', 'device003']}
                onChange={mockOnChange}
                mappings={mockMappings}
                colorMap={mockColorMap}
            />
        );

        const checkboxes = screen.getAllByRole('checkbox');
        // Skip the first two checkboxes (Select All/Deselect All buttons are not checkboxes)
        expect(checkboxes[0]).toBeChecked(); // device001
        expect(checkboxes[1]).not.toBeChecked(); // device002
        expect(checkboxes[2]).toBeChecked(); // device003
    });

    it('handles Select All button click', () => {
        const mockOnChange = jest.fn();
        render(
            <DeviceSelector
                devices={mockDevices}
                selectedDevices={[]}
                onChange={mockOnChange}
                mappings={mockMappings}
                colorMap={mockColorMap}
            />
        );

        const selectAllButton = screen.getByText('Select All');
        fireEvent.click(selectAllButton);

        expect(mockOnChange).toHaveBeenCalledWith(mockDevices);
    });

    it('handles Deselect All button click', () => {
        const mockOnChange = jest.fn();
        render(
            <DeviceSelector
                devices={mockDevices}
                selectedDevices={mockDevices}
                onChange={mockOnChange}
                mappings={mockMappings}
                colorMap={mockColorMap}
            />
        );

        const deselectAllButton = screen.getByText('Deselect All');
        fireEvent.click(deselectAllButton);

        expect(mockOnChange).toHaveBeenCalledWith([]);
    });

    it('handles individual device toggle', () => {
        const mockOnChange = jest.fn();
        render(
            <DeviceSelector
                devices={mockDevices}
                selectedDevices={['device001']}
                onChange={mockOnChange}
                mappings={mockMappings}
                colorMap={mockColorMap}
            />
        );

        const device002Checkbox = screen.getAllByRole('checkbox')[1]; // device002
        fireEvent.click(device002Checkbox);

        expect(mockOnChange).toHaveBeenCalledWith(['device001', 'device002']);
    });

    it('falls back to device ID when no mapping exists', () => {
        const mockOnChange = jest.fn();
        render(
            <DeviceSelector
                devices={mockDevices}
                selectedDevices={[]}
                onChange={mockOnChange}
                mappings={{}} // No mappings
                colorMap={mockColorMap}
            />
        );

        expect(screen.getByText('device001')).toBeInTheDocument();
        expect(screen.getByText('device002')).toBeInTheDocument();
        expect(screen.getByText('device003')).toBeInTheDocument();
    });
});
