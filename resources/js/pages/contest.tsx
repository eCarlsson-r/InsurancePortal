import TemplateLayout from '@/layouts/TemplateLayout';
import { contestSchema } from '@/schemas/models';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Table } from 'react-bootstrap';
import { z } from 'zod';

interface ContestProps {
    contests: z.infer<typeof contestSchema>[];
}

export default function Contest({ contests = [] }: ContestProps) {
    const [contest, setContest] = useState<z.infer<
        typeof contestSchema
    > | null>(null);

    const handleDelete = (contestCode: string) => {
        if (confirm('Are you sure you want to delete this contest?')) {
            router.delete(`/master/contest/${contestCode}`);
        }
    };

    const isEdit = !!contest;

    // Initial form state with safe defaults
    const { data, setData, post, put } = useForm<z.infer<typeof contestSchema>>(
        isEdit && contest
            ? contest
            : {
                  id: undefined,
                  name: '',
                  type: 'annual',
                  start: '',
                  end: '',
                  product: '',
                  level: '',
                  minimum_commision: 0,
                  minimum_premium: 0,
                  minimum_policy: 0,
                  bonus_percent: 0,
                  bonus_amount: 0,
                  reward: '',
              },
    );

    const handleSubmit = () => {
        if (isEdit) {
            put(`/master/contest/${contest?.id}`);
        } else {
            post('/master/contest');
        }
    };

    return (
        <TemplateLayout>
            <Head title="Contest" />

            <div className="container-fluid">
                <div className="row page-titles mx-0">
                    <div className="col-6 p-md-0">
                        <h3
                            className="text-primary d-inline"
                            data-i18n="contest"
                        >
                            Kontes
                        </h3>
                    </div>
                    <div className="col-6 p-md-0 justify-content-end mt-2 mt-0 d-flex">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="javascript:void(0)" data-i18n="master">
                                    Master
                                </a>
                            </li>
                            <li
                                className="breadcrumb-item active"
                                data-i18n="contest"
                            >
                                Kontes
                            </li>
                        </ol>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <div
                                    id="contest-toolbar"
                                    className="toolbar card-title"
                                >
                                    <h4 data-i18n="contest-list">
                                        Daftar Kontes
                                    </h4>
                                </div>
                                <div className="table-responsive">
                                    <Table hover striped bordered>
                                        <thead>
                                            <tr>
                                                <th data-field="contest-name">
                                                    Nama Kontes
                                                </th>
                                                <th data-field="contest-type">
                                                    Jenis Kontes
                                                </th>
                                                <th data-field="contest-start">
                                                    Mulai Kontes
                                                </th>
                                                <th data-field="contest-end">
                                                    Selesai Kontes
                                                </th>
                                                <th data-field="minimum-premium">
                                                    Premi Minimal
                                                </th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {contests.length > 0 ? (
                                                contests.map((contestItem) => (
                                                    <tr
                                                        key={contestItem.id}
                                                        onClick={() =>
                                                            setContest(
                                                                contestItem,
                                                            )
                                                        }
                                                    >
                                                        <td>
                                                            {contestItem.name}
                                                        </td>
                                                        <td>
                                                            {contestItem.type}
                                                        </td>
                                                        <td>
                                                            {new Date(
                                                                contestItem.start,
                                                            ).toLocaleDateString()}
                                                        </td>
                                                        <td>
                                                            {new Date(
                                                                contestItem.end,
                                                            ).toLocaleDateString()}
                                                        </td>
                                                        <td>
                                                            {
                                                                contestItem.minimum_premium
                                                            }
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="btn btn-danger"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        contestItem.id?.toString() ||
                                                                            '',
                                                                    )
                                                                }
                                                            >
                                                                Hapus
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={6}
                                                        className="text-center"
                                                        data-i18n="no-contest"
                                                    >
                                                        Tidak ada kontes
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <form id="contest-form">
                                    <div className="row card-title">
                                        <div className="col-md-9 col-sm-10 col-8">
                                            <h4 data-i18n="edit-contest">
                                                Sunting Kontes
                                            </h4>
                                            <h6 data-i18n="edit-contest-inst">
                                                Masukkan informasi kontes yang
                                                dikejar Agen.
                                            </h6>
                                        </div>
                                        <div className="col-md-3 col-sm-2 col-4">
                                            <button
                                                className="btn btn-primary pull-right"
                                                onClick={handleSubmit}
                                            >
                                                Perbarui
                                            </button>
                                        </div>
                                    </div>
                                    <div className="basic-form">
                                        <div className="row form-group">
                                            <label className="col-sm-3">
                                                Nama Kontes
                                            </label>
                                            <div className="col-sm-9">
                                                <input
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData(
                                                            'name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="row form-group">
                                            <label className="col-sm-3">
                                                Jenis Kontes
                                            </label>
                                            <div className="col-sm-9">
                                                <select
                                                    className="form-control selectpicker"
                                                    value={data.type}
                                                    onChange={(e) =>
                                                        setData(
                                                            'type',
                                                            e.target.value,
                                                        )
                                                    }
                                                >
                                                    <option
                                                        value="annual"
                                                        data-i18n="annual-bonus"
                                                    >
                                                        Annual Bonus
                                                    </option>
                                                    <option
                                                        value="quarter"
                                                        data-i18n="quarter-bonus"
                                                    >
                                                        Quarterly Bonus
                                                    </option>
                                                    <option
                                                        value="bonanza"
                                                        data-i18n="bonanza"
                                                    >
                                                        Bonanza
                                                    </option>
                                                    <option
                                                        value="contest"
                                                        data-i18n="contest"
                                                    >
                                                        Contest
                                                    </option>
                                                    <option
                                                        value="MDRT"
                                                        data-i18n="mdrt"
                                                    >
                                                        MDRT
                                                    </option>
                                                    <option
                                                        value="empire"
                                                        data-i18n="empire-club"
                                                    >
                                                        Empire Club
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row form-group">
                                            <label className="col-sm-3">
                                                Mulai Kontes
                                            </label>
                                            <div className="col-sm-9">
                                                <input
                                                    type="date"
                                                    value={contest?.start}
                                                    onChange={(e) =>
                                                        setData(
                                                            'start',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="row form-group">
                                            <label className="col-sm-3">
                                                Selesai Kontes
                                            </label>
                                            <div className="col-sm-9">
                                                <input
                                                    type="date"
                                                    value={contest?.end}
                                                    onChange={(e) =>
                                                        setData(
                                                            'end',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="row form-group">
                                            <label
                                                className="col-sm-3"
                                                htmlFor="minimum-premium"
                                                data-i18n="minimum-premium"
                                            >
                                                Minimal Premi
                                            </label>
                                            <div className="col-sm-9">
                                                <input
                                                    type="number"
                                                    value={
                                                        contest?.minimum_premium
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            'minimum_premium',
                                                            parseInt(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="row form-group">
                                            <label className="col-sm-3">
                                                Bonus %
                                            </label>
                                            <div className="col-sm-9">
                                                <input
                                                    type="number"
                                                    value={
                                                        contest?.bonus_percent
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            'bonus_percent',
                                                            parseInt(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    min="0"
                                                    max="100"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="row form-group">
                                            <label className="col-sm-3">
                                                Jumlah Bonus
                                            </label>
                                            <div className="col-sm-9">
                                                <input
                                                    type="number"
                                                    value={
                                                        contest?.bonus_amount
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            'bonus_amount',
                                                            parseInt(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="row form-group">
                                            <label className="col-sm-3">
                                                Hadiah
                                            </label>
                                            <div className="col-sm-9">
                                                <input
                                                    type="number"
                                                    value={contest?.reward}
                                                    onChange={(e) =>
                                                        setData(
                                                            'reward',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TemplateLayout>
    );
}
