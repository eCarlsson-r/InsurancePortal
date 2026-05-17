import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Dashboard from '../dashboard';

// Mock TemplateLayout
vi.mock('@/layouts/TemplateLayout', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="template-layout">{children}</div>,
}));

// Helper function to create mock KPI data
const createMockKPIData = (overrides = {}) => ({
    kpis: {
        new_policies: {
            this_month: 10,
            last_month: 8,
            change: 2,
            percentage_change: 25,
        },
        premium_collected: {
            amount: 50000000,
            formatted: 'Rp 50.000.000',
        },
        mdrt_agents: {
            count: 5,
            stats: [],
        },
        active_claims: {
            count: 15,
            pending: 10,
            approved: 5,
        },
        expiring_policies: {
            count: 3,
            list: [],
        },
        birthdays: {
            count: 2,
            list: [],
        },
    },
    empire_stats: [
        {
            agent_no: 'AG001',
            current_trip: 'Gold Trip',
        },
        {
            agent_no: 'AG002',
            current_trip: 'Silver Trip',
        },
    ],
    mdrt_stats: [
        {
            agent_no: 'AG003',
            current_level: 'MDRT',
        },
        {
            agent_no: 'AG004',
            current_level: 'COT',
        },
    ],
    empire_club: [
        {
            agent_no: 'AG001',
            status: 'Active',
            wape: '100,000',
            cases: '10',
            gap_wape: '50,000',
            gap_cases: '5',
        },
        {
            agent_no: 'AG002',
            status: 'Pending',
            wape: '80,000',
            cases: '8',
            gap_wape: '70,000',
            gap_cases: '7',
        },
    ],
    mdrt: [
        {
            agent_no: 'AG003',
            status: 'Qualified',
            fyp: '500,000',
            gap_fyp: '100,000',
        },
        {
            agent_no: 'AG004',
            status: 'In Progress',
            fyp: '400,000',
            gap_fyp: '200,000',
        },
    ],
    ...overrides,
});

describe('Dashboard Component', () => {
    describe('Basic Rendering Tests', () => {
        it('should render without crashing', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            expect(screen.getByTestId('template-layout')).toBeInTheDocument();
        });
        
        it('should use TemplateLayout wrapper', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            expect(screen.getByTestId('template-layout')).toBeInTheDocument();
        });
    });

    describe('Translation Tests', () => {
        it('should call translation for empire stats', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            
            const translatedTexts = screen.getAllByText('dashboard.agents_achieved');
            expect(translatedTexts).toHaveLength(mockData.empire_stats.length);
        });

        it('should call translation for mdrt stats', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            
            const translatedTexts = screen.getAllByText('dashboard.agents_reached');
            expect(translatedTexts).toHaveLength(mockData.mdrt_stats.length);
        });
    });

    describe('Empty State Tests', () => {
        it('should handle zero values in KPI cards correctly', () => {
            const mockData = createMockKPIData({
                kpis: {
                    new_policies: {
                        this_month: 0,
                        last_month: 0,
                        change: 0,
                        percentage_change: 0,
                    },
                    premium_collected: {
                        amount: 0,
                        formatted: 'Rp 0',
                    },
                    mdrt_agents: {
                        count: 0,
                        stats: [],
                    },
                    active_claims: {
                        count: 0,
                        pending: 0,
                        approved: 0,
                    },
                    expiring_policies: {
                        count: 0,
                        list: [],
                    },
                    birthdays: {
                        count: 0,
                        list: [],
                    },
                },
            });
            render(<Dashboard {...mockData} />);
            
            // Should render zeros without errors
            const zeros = screen.getAllByText('0');
            expect(zeros.length).toBeGreaterThan(0);
        });

        it('should not render empire_stats when array is empty', () => {
            const mockData = createMockKPIData({
                empire_stats: [],
            });
            render(<Dashboard {...mockData} />);
            
            expect(screen.queryByText('dashboard.agents_achieved')).not.toBeInTheDocument();
        });

        it('should not render mdrt_stats when array is empty', () => {
            const mockData = createMockKPIData({
                mdrt_stats: [],
            });
            render(<Dashboard {...mockData} />);
            
            expect(screen.queryByText('dashboard.agents_reached')).not.toBeInTheDocument();
        });
    });
});

// Made with Bob
