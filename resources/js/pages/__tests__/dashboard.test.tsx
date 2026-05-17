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

        it('should set page title correctly via Head component', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            expect(document.title).toBe('Dashboard');
        });

        it('should use TemplateLayout wrapper', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            expect(screen.getByTestId('template-layout')).toBeInTheDocument();
        });
    });

    describe('KPI Cards Rendering Tests', () => {
        it('should render New Policies card with correct data', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            
            expect(screen.getByText('New Policies This Month')).toBeInTheDocument();
            expect(screen.getByText('10')).toBeInTheDocument();
            expect(screen.getByText(/Last month: 8/)).toBeInTheDocument();
        });

        it('should render Premium Collected card with formatted amount', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            
            expect(screen.getByText('Premium Collected')).toBeInTheDocument();
            expect(screen.getByText('Rp 50.000.000')).toBeInTheDocument();
            expect(screen.getByText('This month')).toBeInTheDocument();
        });

        it('should render MDRT Agents card with count', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            
            expect(screen.getByText('MDRT-Tracking Agents')).toBeInTheDocument();
            expect(screen.getByText('5')).toBeInTheDocument();
            expect(screen.getByText('Active agents on track')).toBeInTheDocument();
        });

        it('should render Active Claims card with total, pending, approved counts', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            
            expect(screen.getByText('Active Claims')).toBeInTheDocument();
            expect(screen.getByText('15')).toBeInTheDocument();
            expect(screen.getByText(/Pending: 10 \| Approved: 5/)).toBeInTheDocument();
        });

        it('should render Expiring Policies card with count', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            
            expect(screen.getByText('Expiring in 30 Days')).toBeInTheDocument();
            expect(screen.getByText('3')).toBeInTheDocument();
            expect(screen.getByText('Policies requiring renewal')).toBeInTheDocument();
        });

        it('should render Birthdays card with count', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            
            expect(screen.getByText('Birthdays This Week')).toBeInTheDocument();
            expect(screen.getByText('2')).toBeInTheDocument();
            expect(screen.getByText('Customer birthdays')).toBeInTheDocument();
        });
    });

    describe('KPI Data Display Tests', () => {
        it('should show New Policies this_month and last_month values', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            
            expect(screen.getByText('10')).toBeInTheDocument();
            expect(screen.getByText(/Last month: 8/)).toBeInTheDocument();
        });

        it('should show New Policies change and percentage_change', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            
            expect(screen.getByText(/\+2/)).toBeInTheDocument();
            expect(screen.getByText(/\+25%/)).toBeInTheDocument();
        });

        it('should show positive change with success badge', () => {
            const mockData = createMockKPIData({
                kpis: {
                    ...createMockKPIData().kpis,
                    new_policies: {
                        this_month: 10,
                        last_month: 8,
                        change: 2,
                        percentage_change: 25,
                    },
                },
            });
            render(<Dashboard {...mockData} />);
            
            const badge = screen.getByText(/\+2/).closest('.badge');
            expect(badge).toHaveClass('badge-success');
        });

        it('should show negative change with danger badge', () => {
            const mockData = createMockKPIData({
                kpis: {
                    ...createMockKPIData().kpis,
                    new_policies: {
                        this_month: 5,
                        last_month: 10,
                        change: -5,
                        percentage_change: -50,
                    },
                },
            });
            render(<Dashboard {...mockData} />);
            
            const badge = screen.getByText(/-5/).closest('.badge');
            expect(badge).toHaveClass('badge-danger');
        });

        it('should show Premium Collected formatted Indonesian Rupiah', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            
            expect(screen.getByText('Rp 50.000.000')).toBeInTheDocument();
        });

        it('should show Active Claims breakdown (pending/approved)', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            
            expect(screen.getByText(/Pending: 10 \| Approved: 5/)).toBeInTheDocument();
        });

        it('should not show change badge when change is zero', () => {
            const mockData = createMockKPIData({
                kpis: {
                    ...createMockKPIData().kpis,
                    new_policies: {
                        this_month: 10,
                        last_month: 10,
                        change: 0,
                        percentage_change: 0,
                    },
                },
            });
            render(<Dashboard {...mockData} />);
            
            expect(screen.queryByText(/\+0/)).not.toBeInTheDocument();
            expect(screen.queryByText(/0%/)).not.toBeInTheDocument();
        });
    });

    describe('Translation Tests', () => {
        it('should use useTranslation hook', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            
            // Translation keys should be rendered as-is due to our mock
            expect(screen.getByText('dashboard.agents_achieved')).toBeInTheDocument();
            expect(screen.getByText('dashboard.agents_reached')).toBeInTheDocument();
        });

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

    describe('Tables Rendering Tests', () => {
        it('should render Empire Club table with data', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            
            expect(screen.getByText('Empire Club')).toBeInTheDocument();
            expect(screen.getByText('AG001')).toBeInTheDocument();
            expect(screen.getByText('AG002')).toBeInTheDocument();
            expect(screen.getByText('Active')).toBeInTheDocument();
            expect(screen.getByText('100,000')).toBeInTheDocument();
        });

        it('should render MDRT table with data', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            
            expect(screen.getByText('MDRT')).toBeInTheDocument();
            expect(screen.getByText('AG003')).toBeInTheDocument();
            expect(screen.getByText('AG004')).toBeInTheDocument();
            expect(screen.getByText('Qualified')).toBeInTheDocument();
            expect(screen.getByText('500,000')).toBeInTheDocument();
        });

        it('should show "No Data" when Empire Club table is empty', () => {
            const mockData = createMockKPIData({
                empire_club: [],
            });
            render(<Dashboard {...mockData} />);
            
            const noDataCells = screen.getAllByText('No Data');
            expect(noDataCells.length).toBeGreaterThan(0);
        });

        it('should show "No Data" when MDRT table is empty', () => {
            const mockData = createMockKPIData({
                mdrt: [],
            });
            render(<Dashboard {...mockData} />);
            
            const noDataCells = screen.getAllByText('No Data');
            expect(noDataCells.length).toBeGreaterThan(0);
        });

        it('should render Empire Club table headers correctly', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            
            expect(screen.getByText('Agent')).toBeInTheDocument();
            expect(screen.getByText('Status')).toBeInTheDocument();
            expect(screen.getByText('WAPE')).toBeInTheDocument();
            expect(screen.getByText('Cases')).toBeInTheDocument();
            expect(screen.getByText('Gap WAPE')).toBeInTheDocument();
            expect(screen.getByText('Gap Cases')).toBeInTheDocument();
        });

        it('should render MDRT table headers correctly', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            
            const agentHeaders = screen.getAllByText('Agent');
            const statusHeaders = screen.getAllByText('Status');
            expect(agentHeaders.length).toBeGreaterThan(0);
            expect(statusHeaders.length).toBeGreaterThan(0);
            expect(screen.getByText('FYP')).toBeInTheDocument();
            expect(screen.getByText('Gap FYP')).toBeInTheDocument();
        });

        it('should display correct data in Empire Club table rows', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            
            expect(screen.getByText('AG001')).toBeInTheDocument();
            expect(screen.getByText('Active')).toBeInTheDocument();
            expect(screen.getByText('100,000')).toBeInTheDocument();
            expect(screen.getByText('10')).toBeInTheDocument();
            expect(screen.getByText('50,000')).toBeInTheDocument();
            expect(screen.getByText('5')).toBeInTheDocument();
        });

        it('should display correct data in MDRT table rows', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            
            expect(screen.getByText('AG003')).toBeInTheDocument();
            expect(screen.getByText('Qualified')).toBeInTheDocument();
            expect(screen.getByText('500,000')).toBeInTheDocument();
            expect(screen.getByText('100,000')).toBeInTheDocument();
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

        it('should handle empty arrays in tables', () => {
            const mockData = createMockKPIData({
                empire_club: [],
                mdrt: [],
            });
            render(<Dashboard {...mockData} />);
            
            const noDataMessages = screen.getAllByText('No Data');
            expect(noDataMessages.length).toBe(2); // One for each table
        });

        it('should show "No Data" message for empty Empire Club table', () => {
            const mockData = createMockKPIData({
                empire_club: [],
            });
            render(<Dashboard {...mockData} />);
            
            expect(screen.getByText('Empire Club')).toBeInTheDocument();
            const noDataCells = screen.getAllByText('No Data');
            expect(noDataCells.length).toBeGreaterThan(0);
        });

        it('should show "No Data" message for empty MDRT table', () => {
            const mockData = createMockKPIData({
                mdrt: [],
            });
            render(<Dashboard {...mockData} />);
            
            expect(screen.getByText('MDRT')).toBeInTheDocument();
            const noDataCells = screen.getAllByText('No Data');
            expect(noDataCells.length).toBeGreaterThan(0);
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

    describe('Data Structure Tests', () => {
        it('should handle complete KPI data structure', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            
            // Verify all KPI sections render
            expect(screen.getByText('New Policies This Month')).toBeInTheDocument();
            expect(screen.getByText('Premium Collected')).toBeInTheDocument();
            expect(screen.getByText('MDRT-Tracking Agents')).toBeInTheDocument();
            expect(screen.getByText('Active Claims')).toBeInTheDocument();
            expect(screen.getByText('Expiring in 30 Days')).toBeInTheDocument();
            expect(screen.getByText('Birthdays This Week')).toBeInTheDocument();
        });

        it('should render empire_stats with correct structure', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            
            expect(screen.getByText('AG001')).toBeInTheDocument();
            expect(screen.getByText('Gold Trip')).toBeInTheDocument();
            expect(screen.getByText('AG002')).toBeInTheDocument();
            expect(screen.getByText('Silver Trip')).toBeInTheDocument();
        });

        it('should render mdrt_stats with correct structure', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            
            expect(screen.getByText('AG003')).toBeInTheDocument();
            expect(screen.getByText('MDRT')).toBeInTheDocument();
            expect(screen.getByText('AG004')).toBeInTheDocument();
            expect(screen.getByText('COT')).toBeInTheDocument();
        });

        it('should handle multiple items in empire_club array', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            
            expect(screen.getByText('AG001')).toBeInTheDocument();
            expect(screen.getByText('AG002')).toBeInTheDocument();
        });

        it('should handle multiple items in mdrt array', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            
            expect(screen.getByText('AG003')).toBeInTheDocument();
            expect(screen.getByText('AG004')).toBeInTheDocument();
        });

        it('should render all empire_club columns correctly', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            
            const firstRow = mockData.empire_club[0];
            expect(screen.getByText(firstRow.agent_no)).toBeInTheDocument();
            expect(screen.getByText(firstRow.status)).toBeInTheDocument();
            expect(screen.getByText(firstRow.wape)).toBeInTheDocument();
            expect(screen.getByText(firstRow.cases)).toBeInTheDocument();
            expect(screen.getByText(firstRow.gap_wape)).toBeInTheDocument();
            expect(screen.getByText(firstRow.gap_cases)).toBeInTheDocument();
        });

        it('should render all mdrt columns correctly', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            
            const firstRow = mockData.mdrt[0];
            expect(screen.getByText(firstRow.agent_no)).toBeInTheDocument();
            expect(screen.getByText(firstRow.status)).toBeInTheDocument();
            expect(screen.getByText(firstRow.fyp)).toBeInTheDocument();
            expect(screen.getByText(firstRow.gap_fyp)).toBeInTheDocument();
        });
    });

    describe('Component Integration Tests', () => {
        it('should render all sections together', () => {
            const mockData = createMockKPIData();
            render(<Dashboard {...mockData} />);
            
            // KPI Cards
            expect(screen.getByText('New Policies This Month')).toBeInTheDocument();
            
            // Stats boxes
            expect(screen.getByText('dashboard.agents_achieved')).toBeInTheDocument();
            
            // Tables
            expect(screen.getByText('Empire Club')).toBeInTheDocument();
            expect(screen.getByText('MDRT')).toBeInTheDocument();
        });

        it('should maintain layout structure with all components', () => {
            const mockData = createMockKPIData();
            const { container } = render(<Dashboard {...mockData} />);
            
            // Check for main container
            expect(container.querySelector('.container-fluid')).toBeInTheDocument();
            
            // Check for KPI cards row
            const rows = container.querySelectorAll('.row');
            expect(rows.length).toBeGreaterThan(0);
        });

        it('should render correct number of KPI cards', () => {
            const mockData = createMockKPIData();
            const { container } = render(<Dashboard {...mockData} />);
            
            const kpiCards = container.querySelectorAll('.widget-stat.card');
            expect(kpiCards.length).toBeGreaterThanOrEqual(6); // 6 main KPI cards
        });

        it('should apply correct Bootstrap classes to KPI cards', () => {
            const mockData = createMockKPIData();
            const { container } = render(<Dashboard {...mockData} />);
            
            expect(container.querySelector('.bg-primary')).toBeInTheDocument();
            expect(container.querySelector('.bg-success')).toBeInTheDocument();
            expect(container.querySelector('.bg-info')).toBeInTheDocument();
            expect(container.querySelector('.bg-warning')).toBeInTheDocument();
            expect(container.querySelector('.bg-danger')).toBeInTheDocument();
            expect(container.querySelector('.bg-secondary')).toBeInTheDocument();
        });
    });
});

// Made with Bob
