import { render, screen } from '@testing-library/react';
import { HeatmapComponent } from './HeatmapComponent';
import { createMockGroupedData, createMockMappings } from '../test-utils';

describe('HeatmapComponent', () => {
    const mockData = createMockGroupedData(2, 6);
    const mockDevices = Object.keys(mockData);
    const mockMappings = createMockMappings(mockDevices);

    it('renders heatmap with correct title', () => {
        render(
            <HeatmapComponent
                groupedData={mockData}
                selectedDevices={mockDevices}
                selectedMetric="hum"
                mappings={mockMappings}
            />
        );

        expect(screen.getByText('Humidity Heatmap')).toBeInTheDocument();
    });

    it('shows temperature heatmap title for tmp metric', () => {
        render(
            <HeatmapComponent
                groupedData={mockData}
                selectedDevices={mockDevices}
                selectedMetric="tmp"
                mappings={mockMappings}
            />
        );

        expect(screen.getByText('Temperature Heatmap')).toBeInTheDocument();
    });

    it('shows battery heatmap title for bat metric', () => {
        render(
            <HeatmapComponent
                groupedData={mockData}
                selectedDevices={mockDevices}
                selectedMetric="bat"
                mappings={mockMappings}
            />
        );

        expect(screen.getByText('Battery Heatmap')).toBeInTheDocument();
    });

    it('renders device names from mappings', () => {
        render(
            <HeatmapComponent
                groupedData={mockData}
                selectedDevices={mockDevices}
                selectedMetric="hum"
                mappings={mockMappings}
            />
        );

        expect(screen.getByText('Living Room Sensor')).toBeInTheDocument();
        expect(screen.getByText('Kitchen Sensor')).toBeInTheDocument();
    });

    it('shows no data message when no devices selected', () => {
        render(
            <HeatmapComponent
                groupedData={mockData}
                selectedDevices={[]}
                selectedMetric="hum"
                mappings={mockMappings}
            />
        );

        expect(screen.getByText('No data available for heatmap')).toBeInTheDocument();
    });

    it('shows no data message when groupedData is empty', () => {
        render(
            <HeatmapComponent
                groupedData={{}}
                selectedDevices={mockDevices}
                selectedMetric="hum"
                mappings={mockMappings}
            />
        );

        expect(screen.getByText('No data available for heatmap')).toBeInTheDocument();
    });

    it('renders legend with min and max values', () => {
        render(
            <HeatmapComponent
                groupedData={mockData}
                selectedDevices={mockDevices}
                selectedMetric="hum"
                mappings={mockMappings}
            />
        );

        expect(screen.getByText('Low')).toBeInTheDocument();
        expect(screen.getByText('High')).toBeInTheDocument();
    });
});