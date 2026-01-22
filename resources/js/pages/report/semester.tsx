import SelectInput from '@/components/form/select-input';
import TablePage from '@/layouts/TablePage';
import { router } from '@inertiajs/react';
import { Table } from 'react-bootstrap';

export default function Semester({ data, year }: { data: any[]; year: string }) {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get('/reports/semester', {
            year: e.target.value,
        });
    };

    return (
        <TablePage
            headTitle="Semester"
            title="Penghasilan Semester"
            i18nTitle="semester-report"
            breadcrumbs={[
                { label: 'Laporan', href: 'javascript:void(0)', i18n: 'report' },
                { label: 'Penghasilan Semester', active: true, i18n: 'semester-report' },
            ]}
            toolbar={
                <div className="d-flex align-items-center justify-content-between w-100">
                    <h4 className="card-title mb-0" data-i18n="customer-religion-report">
                        Income List per Semester
                    </h4>
                    <div className="d-flex align-items-center gap-2">
                        <SelectInput
                            id="semester-year"
                            label="Year"
                            style={{ width: '200px' }}
                            value={year}
                            onChange={handleChange}
                            options={[
                                { value: '', label: 'Pilih Tahun' },
                                ...Array.from({ length: 10 }, (_, i) => ({
                                    value: (new Date().getFullYear() - i).toString(),
                                    label: (new Date().getFullYear() - i).toString(),
                                })),
                            ]}
                        />
                    </div>
                </div>
            }
        >
            <Table hover striped bordered>
                <thead>
                    <tr>
                        <th data-field="agent-number">Kode Agen</th>
                        <th data-field="agent-name">Nama Agen</th>
                        <th data-field="january">Januari</th>
                        <th data-field="february">Februari</th>
                        <th data-field="march">Maret</th>
                        <th data-field="april">April</th>
                        <th data-field="may">Mei</th>
                        <th data-field="june">Juni</th>
                        <th data-field="s1">Q1</th>
                        <th data-field="s1-bonus">Q2</th>
                        <th data-field="july">Juli</th>
                        <th data-field="august">Agustus</th>
                        <th data-field="september">September</th>
                        <th data-field="october">Oktober</th>
                        <th data-field="november">November</th>
                        <th data-field="december">Desember</th>
                        <th data-field="s2">Q3</th>
                        <th data-field="s2-bonus">Q4</th>
                        <th data-field="total">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((record) => (
                            <tr key={record.agent_id}>
                                <td>{record.agent_number}</td>
                                <td>{record.agent_name}</td>
                        <th data-field="january">Januari</th>
                        <th data-field="february">Februari</th>
                        <th data-field="march">Maret</th>
                        <th data-field="april">April</th>
                        <th data-field="may">Mei</th>
                        <th data-field="june">Juni</th>
                        <th data-field="s1">Q1</th>
                        <th data-field="s1-bonus">Q2</th>
                        <th data-field="july">Juli</th>
                        <th data-field="august">Agustus</th>
                        <th data-field="september">September</th>
                        <th data-field="october">Oktober</th>
                        <th data-field="november">November</th>
                        <th data-field="december">Desember</th>
                        <th data-field="s2">Q3</th>
                        <th data-field="s2-bonus">Q4</th>
                        <th data-field="total">Total</th>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center text-muted py-4">
                                No customer found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </TablePage>
    );
}
