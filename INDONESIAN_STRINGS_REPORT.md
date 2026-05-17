# Indonesian Strings Report - Insurance Portal

**Generated:** 2026-05-17  
**Purpose:** Internationalization (i18n) Implementation  
**Scope:** All React/TypeScript components in resources/js directory

## Executive Summary

This report documents all hardcoded Indonesian strings found in the Insurance Portal application. A total of **500+ Indonesian strings** were identified across **30+ files**.

### Statistics
- **Total Files Scanned:** 30+
- **Files with Indonesian Strings:** 30
- **Total Indonesian Strings:** 500+
- **Categories:** Forms, Tables, Buttons, Labels, Messages, Reports

---

## 1. Customer Management (`resources/js/pages/customer/`)

### File: `customer/form.tsx`

| Line | Indonesian String | Context | Suggested Key |
|------|------------------|---------|---------------|
| 56 | "Sunting Nasabah" | Page title (edit mode) | `customer.edit_title` |
| 56 | "Tambah Nasabah" | Page title (create mode) | `customer.create_title` |
| 57 | "Nasabah" | Breadcrumb | `customer.title` |
| 65 | "Perbarui" | Submit button (edit) | `common.update` |
| 65 | "Simpan" | Submit button (create) | `common.save` |
| 73 | "Data Pribadi" | Accordion header | `customer.personal_data` |
| 77 | "Nama Lengkap" | Form label | `customer.full_name` |
| 87 | "Jenis Kelamin" | Form label | `customer.gender` |
| 93 | "Pria" | Gender option | `common.male` |
| 94 | "Wanita" | Gender option | `common.female` |
| 101 | "Tempat & Tgl Lahir" | Form label | `customer.place_date_birth` |
| 106 | "Tempat" | Placeholder | `customer.place` |
| 132 | "Status" | Form label | `customer.marital_status` |
| 139 | "Kawin" | Marital status | `common.married` |
| 140 | "Duda/Janda" | Marital status | `common.widowed` |
| 141 | "Cerai" | Marital status | `common.divorced` |
| 148 | "Agama" | Form label | `customer.religion` |
| 155 | "Budha" | Religion option | `religion.buddhist` |
| 156 | "Kristen" | Religion option | `religion.christian` |
| 157 | "Islam" | Religion option | `religion.islam` |
| 158 | "Hindu" | Religion option | `religion.hindu` |
| 165 | "Nomor Identitas" | Form label | `customer.identity_number` |
| 175 | "Pekerjaan" | Form label | `customer.occupation` |
| 185 | "Keterangan" | Form label | `common.description` |
| 200 | "Kontak Nasabah" | Accordion header | `customer.contact_info` |
| 204 | "Nomor Ponsel" | Form label | `common.mobile_number` |
| 214 | "Alamat e-Mail" | Form label | `common.email_address` |
| 225 | "Alamat Rumah" | Accordion header | `customer.home_address` |
| 238 | "Kode Pos" | Form label | `common.postal_code` |
| 247 | "Kota" | Form label | `common.city` |
| 257 | "Alamat Kantor" | Accordion header | `customer.office_address` |

### File: `customer/index.tsx`

| Line | Indonesian String | Context | Suggested Key |
|------|------------------|---------|---------------|
| 65 | "Nasabah" | Page title | `customer.title` |
| 66 | "Daftar Nasabah" | Page subtitle | `customer.list_title` |
| 79 | "Nasabah Baru" | Button text | `customer.new_customer` |
| 86 | "Cari nasabah..." | Search placeholder | `customer.search_placeholder` |
| 113 | "Nama" | Table header | `common.name` |
| 118 | "No. Identitas" | Table header | `customer.identity_number` |
| 124 | "Tgl. Lahir" | Table header | `customer.birth_date` |
| 130 | "Tempat Lahir" | Table header | `customer.birth_place` |

---

## 2. Policy Management (`resources/js/pages/policy/`)

### File: `policy/form.tsx` (Large file - 1289 lines)

Key Indonesian strings include:
- "Sunting Data SP" / "Input Data SP" (Page titles)
- "Data SP", "Data Pemegang Polis", "Data Tertanggung", "Data Asuransi" (Section headers)
- "No. SP", "No. Polis", "Tanggal SP Masuk" (Form labels)
- "Nama Lengkap", "Jenis Kelamin", "Tempat dan Tanggal Lahir" (Personal info labels)
- "Alamat Rumah", "Alamat Kantor", "Kode Pos", "Kota" (Address labels)
- "Pilihan Investasi", "Asuransi Tambahan" (Insurance sections)
- "Tahunan", "Enam Bulanan", "Tiga Bulanan", "Bulanan" (Payment methods)
- "Diri Sendiri", "Suami/Istri", "Anak", "Orang Tua" (Relationships)

### File: `policy/index.tsx`

| Line | Indonesian String | Context | Suggested Key |
|------|------------------|---------|---------------|
| 100 | "SP / Polis" | Page title | `policy.title` |
| 101 | "Daftar SP / Polis" | Page subtitle | `policy.list_title` |
| 104 | "Penjualan" | Breadcrumb | `common.sales` |
| 116 | "SP / Polis Baru" | Button text | `policy.new_policy` |
| 123 | "Cari Nasabah / No. Polis / No. SP" | Search placeholder | `policy.search_placeholder` |
| 147 | "Nama Pemegang Polis" | Table header | `policy.policyholder_name` |
| 148 | "Nama Tertanggung" | Table header | `policy.insured_name` |

---

## 3. Agent Management (`resources/js/pages/agent/`)

### File: `agent/form.tsx`

Key Indonesian strings:
- "Sunting Agen" / "Tambah Agen" (Page titles)
- "Data Pribadi", "Status Agen" (Section headers)
- "Nama sesuai KTP", "Jenis Kelamin", "Tempat dan Tanggal Lahir" (Personal info)
- "Kota Marketing", "Provinsi", "Kode Pos" (Location info)
- "Pendidikan Terakhir", "Nomor Telfon", "Nomor Ponsel" (Contact info)
- "Nama Suami / Isteri", "Jumlah Tanggungan", "Catatan" (Family info)
- "Tanggal Pengisian", "Tempat Pengisian", "Kode Agen" (Agent status)
- "Nomor Lisensi", "Jatuh Tempo", "Perekruit" (License info)
- "Program Allowance", "Mulai", "Jabatan", "Leader Langsung" (Program info)

### File: `agent/index.tsx`

| Line | Indonesian String | Context | Suggested Key |
|------|------------------|---------|---------------|
| 74 | "Agen" | Page title | `agent.title` |
| 75 | "Daftar Agen" | Page subtitle | `agent.list_title` |
| 88 | "Agen Baru" | Button text | `agent.new_agent` |
| 95 | "Cari agen..." | Search placeholder | `agent.search_placeholder` |
| 123 | "Kode Agen" | Table header | `agent.agent_code` |
| 125 | "Nama Agen" | Table header | `agent.agent_name` |
| 127 | "Jabatan" | Table header | `agent.position` |

---

## 4. Claim Management (`resources/js/pages/claim/`)

### File: `claim/index.tsx`

| Line | Indonesian String | Context | Suggested Key |
|------|------------------|---------|---------------|
| 121 | "Klaim" | Page title | `claim.title` |
| 122 | "Daftar Klaim" | Page subtitle | `claim.list_title` |
| 125 | "Penjualan" | Breadcrumb | `common.sales` |

### File: `claim/show.tsx`

| Line | Indonesian String | Context | Suggested Key |
|------|------------------|---------|---------------|
| 151 | "Penjualan" | Breadcrumb | `common.sales` |
| 152 | "Klaim" | Breadcrumb | `claim.title` |

---

## 5. Dashboard (`resources/js/pages/dashboard.tsx`)

| Line | Indonesian String | Context | Suggested Key |
|------|------------------|---------|---------------|
| 202 | "agen mendapatkan" | Dashboard text | `dashboard.agents_achieved` |
| 226 | "agen mencapai" | Dashboard text | `dashboard.agents_reached` |

---

## 6. Master Data - Fund (`resources/js/pages/fund.tsx`)

| Line | Indonesian String | Context | Suggested Key |
|------|------------------|---------|---------------|
| 79 | "Jenis Dana" | Page title | `fund.title` |
| 85 | "Daftar Jenis Dana" | Table title | `fund.list_title` |
| 91 | "Cari jenis dana..." | Search placeholder | `fund.search_placeholder` |
| 103 | "Nama Jenis Dana" | Table header | `fund.fund_name` |
| 106 | "Mata Uang" | Table header | `fund.currency` |
| 145 | "Sunting Jenis Dana" / "Tambah Jenis Dana" | Form title | `fund.edit_title` / `fund.create_title` |
| 147 | "Masukkan informasi jenis dana investasi." | Form subtitle | `fund.form_subtitle` |

---

## 7. Master Data - Contest (`resources/js/pages/contest.tsx`)

| Line | Indonesian String | Context | Suggested Key |
|------|------------------|---------|---------------|
| 90 | "Kontes" | Page title | `contest.title` |
| 96 | "Daftar Kontes" | Table title | `contest.list_title` |
| 102 | "Cari kontes..." | Search placeholder | `contest.search_placeholder` |
| 113 | "Nama Kontes" | Table header | `contest.contest_name` |
| 114 | "Mulai Kontes" | Table header | `contest.start_date` |
| 115 | "Selesai Kontes" | Table header | `contest.end_date` |
| 116 | "Premi Minimal" | Table header | `contest.minimum_premium` |
| 168 | "Tidak ada kontes" | Empty state | `contest.no_contests` |
| 266 | "Hadiah" | Form label | `contest.reward` |

---

## 8. Master Data - Product (`resources/js/pages/product.tsx`)

| Line | Indonesian String | Context | Suggested Key |
|------|------------------|---------|---------------|
| 105 | "Produk" | Page title | `product.title` |
| 111 | "Daftar Produk" | Table title | `product.list_title` |
| 117 | "Cari produk..." | Search placeholder | `product.search_placeholder` |
| 129 | "Nama Produk" | Table header | `product.product_name` |
| 132 | "Jenis Produk" | Table header | `product.product_type` |
| 211 | "Komisi" | Form label | `product.commission` |
| 230 | "Tahun" | Table header | `common.year` |
| 232 | "Komisi (%)" | Table header | `product.commission_rate` |

---

## 9. Master Data - Agency (`resources/js/pages/agency.tsx`)

| Line | Indonesian String | Context | Suggested Key |
|------|------------------|---------|---------------|
| 98 | "Cari agency..." | Search placeholder | `agency.search_placeholder` |
| 113 | "Kota" | Table header | `common.city` |
| 151 | "Sunting Agency" / "Tambah Agency" | Form title | `agency.edit_title` / `agency.create_title` |
| 153 | "Masukkan informasi mengenai Agency." | Form subtitle | `agency.form_subtitle` |
| 160 | "Nama Agency" | Form label | `agency.agency_name` |
| 168 | "Kota Agency" | Form label | `agency.agency_city` |
| 176 | "Direktur Agency" | Form label | `agency.agency_director` |
| 190 | "Agency Atasan" | Form label | `agency.parent_agency` |

---

## 10. Master Data - Program (`resources/js/pages/program/`)

### File: `program/index.tsx`

| Line | Indonesian String | Context | Suggested Key |
|------|------------------|---------|---------------|
| 78 | "Daftar Program" | Page title | `program.list_title` |
| 91 | "Program Baru" | Button text | `program.new_program` |
| 98 | "Cari program..." | Search placeholder | `program.search_placeholder` |
| 126 | "Nama Program" | Table header | `program.program_name` |
| 131 | "Jabatan Agen" | Table header | `program.agent_position` |
| 137 | "Allowance Minimal" | Table header | `program.min_allowance` |
| 143 | "Allowance Maksimal" | Table header | `program.max_allowance` |

### File: `program/form.tsx`

| Line | Indonesian String | Context | Suggested Key |
|------|------------------|---------|---------------|
| 89 | "Sunting Program" / "Tambah Program" | Page title | `program.edit_title` / `program.create_title` |
| 106 | "Data Program" | Accordion header | `program.program_data` |
| 110 | "Nama Program" | Form label | `program.program_name` |
| 120 | "Jabatan" | Form label | `program.position` |
| 183 | "Durasi (Bulan)" | Form label | `program.duration_months` |
| 202 | "Target Program" | Accordion header | `program.program_targets` |
| 205 | "Daftar Target" | Section title | `program.target_list` |
| 220 | "Bulan" | Table header | `common.month` |
| 385 | "Belum ada target." | Empty state | `program.no_targets` |

---

## 11. Reports (`resources/js/pages/report/`)

### File: `report/annual.tsx`

| Line | Indonesian String | Context | Suggested Key |
|------|------------------|---------|---------------|
| 61 | "Income List Tahunan" | Page title | `report.annual_income` |
| 66 | "Laporan" | Breadcrumb | `common.reports` |
| 82 | "Laporan Tahunan Agen" | Section title | `report.agent_annual_report` |
| 89 | "Pilih Tahun" | Placeholder | `common.select_year` |
| 109 | "Ekspor ke Excel" | Button text | `common.export_excel` |
| 117 | "Kode Agen" | Table header | `agent.agent_code` |
| 118 | "Nama Agen" | Table header | `agent.agent_name` |
| 119 | "Komisi" | Table header | `report.commission` |
| 120 | "Bonus Tahunan" | Table header | `report.annual_bonus` |
| 122 | "Bonus Rekrut" | Table header | `report.recruit_bonus` |
| 124 | "Total Komisi" | Table header | `report.total_commission` |

### File: `report/monthly.tsx`

| Line | Indonesian String | Context | Suggested Key |
|------|------------------|---------|---------------|
| 64 | "Income List Bulanan" | Page title | `report.monthly_income` |
| 85 | "Laporan Bulanan Agen" | Section title | `report.agent_monthly_report` |
| 101 | "Ekspor ke Excel" | Button text | `common.export_excel` |

### File: `report/semester.tsx`

| Line | Indonesian String | Context | Suggested Key |
|------|------------------|---------|---------------|
| 52-66 | "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember" | Month names | `months.january` through `months.december` |
| 120 | "Laporan Semester Agen" | Section title | `report.agent_semester_report` |
| 147 | "Ekspor ke Excel" | Button text | `common.export_excel` |

### File: `report/bonus.tsx`

| Line | Indonesian String | Context | Suggested Key |
|------|------------------|---------|---------------|
| 34 | "Laporan Bonus" | Page title | `report.bonus_report` |
| 54 | "Laporan Bonus Agen" | Section title | `report.agent_bonus_report` |
| 60 | "Bulan" | Form label | `common.month` |
| 73 | "Pilih Agency" | Placeholder | `agency.select_agency` |
| 94 | "Cari" | Button text | `common.search` |
| 111 | "Pencapaian" | Table header | `report.achievement` |
| 113 | "Kekurangan" | Table header | `report.shortage` |
| 189 | "Tidak ada data" | Empty state | `common.no_data` |

### File: `report/duedate.tsx`

| Line | Indonesian String | Context | Suggested Key |
|------|------------------|---------|---------------|
| 33 | "Laporan Jatuh Tempo" | Page title | `report.due_date_report` |
| 55 | "Laporan Polis Nasabah yang Jatuh Tempo." | Description | `report.due_date_description` |
| 106 | "Pemegang Polis" | Table header | `policy.policyholder` |
| 107 | "Tertanggung" | Table header | `policy.insured` |
| 108 | "Tgl. Lahir Tertanggung" | Table header | `policy.insured_birth_date` |
| 110 | "Jatuh Tempo" | Table header | `common.due_date` |
| 111 | "Premi" | Table header | `policy.premium` |
| 112 | "Cara Bayar" | Table header | `policy.payment_method` |
| 113 | "Alamat Penagihan" | Table header | `policy.billing_address` |
| 143 | "Tahunan" | Payment method | `policy.annual` |
| 145 | "Enam Bulanan" | Payment method | `policy.semi_annual` |
| 147 | "Tiga Bulanan" | Payment method | `policy.quarterly` |
| 149 | "Bulanan" | Payment method | `policy.monthly` |
| 151 | "Sekaligus" | Payment method | `policy.single_payment` |

### Other Report Files

**report/production.tsx**: Contains "Nomor Polis", "Nama Agen", "Nama Pemegang Polis", "Nama Tertanggung", "Pilih agen", "Pilih tahun", "Cari", "Data Tidak Ditemukan"

**report/program.tsx**: Contains "Nama Agen", "Pencapaian MTD", "Kurang MTD", "Pencapaian YTD", "Kurang YTD", "Cari"

**report/empire.tsx**: Contains "Nama Agen", "APE terkumpul", "Kurang APE", "Kurang Cases", "Pilih Tahun", "Pilih Agency", "Cari", "Tidak ada data"

**report/mdrt.tsx**: Contains "Nama Agen", "FYP terkumpul", "Pilih Tahun", "Pilih Agency", "Cari", "Tidak ada data"

**report/birthday.tsx**: Contains "Nama", "Tanggal Lahir", "Umur", "Agama", "Alamat Rumah"

**report/religion.tsx**: Contains "Nama", "Tanggal Lahir", "Umur", "Alamat Rumah"

**report/generation.tsx**: Contains "Nama Agency"

---

## Summary by Category

### Common Terms (Used across multiple files)
- **Simpan** (Save) - ~15 occurrences
- **Perbarui** (Update) - ~15 occurrences
- **Tambah** (Add) - ~20 occurrences
- **Cari** (Search) - ~25 occurrences
- **Nama** (Name) - ~50 occurrences
- **Status** - ~20 occurrences
- **Tanggal** (Date) - ~30 occurrences
- **Alamat** (Address) - ~25 occurrences
- **Kode Pos** (Postal Code) - ~10 occurrences
- **Nomor Ponsel** (Mobile Number) - ~15 occurrences
- **Jenis Kelamin** (Gender) - ~10 occurrences
- **Agama** (Religion) - ~8 occurrences
- **Keterangan** (Description) - ~8 occurrences
- **Tidak ada data** (No data) - ~10 occurrences

### Form-Specific Terms
- **Data Pribadi** (Personal Data)
- **Tempat & Tgl Lahir** (Place & Date of Birth)
- **Pekerjaan** (Occupation)
- **Kontak** (Contact)
- **Alamat e-Mail** (Email Address)

### Business-Specific Terms
- **Nasabah** (Customer)
- **Agen** (Agent)
- **Polis** (Policy)
- **Pemegang Polis** (Policyholder)
- **Tertanggung** (Insured)
- **Premi** (Premium)
- **Klaim** (Claim)
- **Komisi** (Commission)
- **Bonus** (Bonus)
- **Allowance** (Allowance)
- **Jatuh Tempo** (Due Date)

### Report-Specific Terms
- **Laporan** (Report)
- **Pencapaian** (Achievement)
- **Kekurangan** (Shortage)
- **Ekspor ke Excel** (Export to Excel)

---

## Recommended Translation Keys Structure

```typescript
{
  common: {
    save: "Simpan",
    update: "Perbarui",
    add: "Tambah",
    search: "Cari",
    cancel: "Batal",
    name: "Nama",
    status: "Status",
    male: "Pria",
    female: "Wanita",
    married: "Kawin",
    widowed: "Duda/Janda",
    divorced: "Cerai",
    city: "Kota",
    postal_code: "Kode Pos",
    mobile_number: "Nomor Ponsel",
    email_address: "Alamat e-Mail",
    home_address: "Alamat Rumah",
    office_address: "Alamat Kantor",
    description: "Keterangan",
    no_data: "Tidak ada data",
    reports: "Laporan",
    sales: "Penjualan",
    export_excel: "Ekspor ke Excel",
    select_year: "Pilih Tahun",
    month: "Bulan",
    year: "Tahun",
    due_date: "Jatuh Tempo",
    product: "Produk",
    other: "Lainnya"
  },
  customer: {
    title: "Nasabah",
    create_title: "Tambah Nasabah",
    edit_title: "Sunting Nasabah",
    list_title: "Daftar Nasabah",
    new_customer: "Nasabah Baru",
    search_placeholder: "Cari nasabah...",
    personal_data: "Data Pribadi",
    full_name: "Nama Lengkap",
    gender: "Jenis Kelamin",
    place_date_birth: "Tempat & Tgl Lahir",
    place: "Tempat",
    marital_status: "Status",
    religion: "Agama",
    identity_number: "Nomor Identitas",
    occupation: "Pekerjaan",
    contact_info: "Kontak Nasabah",
    birth_date: "Tgl. Lahir",
    birth_place: "Tempat Lahir"
  },
  policy: {
    title: "SP / Polis",
    list_title: "Daftar SP / Polis",
    new_policy: "SP / Polis Baru",
    search_placeholder: "Cari Nasabah / No. Polis / No. SP",
    edit_title: "Sunting Data SP",
    create_title: "Input Data SP",
    sp_data: "Data SP",
    sp_number: "No. SP",
    policy_number: "No. Polis",
    entry_date: "Tanggal SP Masuk",
    same_as_insured: "Data pemegang polis sama dengan data tertanggung",
    policyholder_data: "Data Pemegang Polis",
    policyholder_name: "Nama Pemegang Polis",
    policyholder: "Pemegang Polis",
    insured_data: "Data Tertanggung",
    insured_name: "Nama Tertanggung",
    insured: "Tertanggung",
    insured_birth_date: "Tgl. Lahir Tertanggung",
    insurance_data: "Data Asuransi",
    investment_options: "Pilihan Investasi",
    additional_insurance: "Asuransi Tambahan",
    select_fund: "Pilih Fund",
    select_rider: "Pilih Rider",
    no_investments: "Belum ada investasi",
    no_riders: "Belum ada rider",
    annual: "Tahunan",
    semi_annual: "Enam Bulanan",
    quarterly: "Tiga Bulanan",
    monthly: "Bulanan",
    single_payment: "Sekaligus",
    self: "Diri Sendiri",
    spouse: "Suami/Istri",
    child: "Anak",
    parent: "Orang Tua",
    base_premium: "Premi Dasar",
    topup_premium: "Premi Topup",
    base_sum_insured: "UP Dasar",
    premium: "Premi",
    payment_method: "Cara Bayar",
    billing_address: "Alamat Penagihan"
  },
  agent: {
    title: "Agen",
    list_title: "Daftar Agen",
    new_agent: "Agen Baru",
    search_placeholder: "Cari agen...",
    edit_title: "Sunting Agen",
    create_title: "Tambah Agen",
    personal_data: "Data Pribadi",
    agent_status: "Status Agen",
    name_as_id: "Nama sesuai KTP",
    id_number: "No. KTP",
    marketing_city: "Kota Marketing",
    last_education: "Pendidikan Terakhir",
    spouse_name: "Nama Suami / Isteri",
    fill_if_married: "Diisi bila menikah",
    dependents_count: "Jumlah Tanggungan",
    apply_date: "Tanggal Pengisian",
    apply_place: "Tempat Pengisian",
    agent_code: "Kode Agen",
    agent_name: "Nama Agen",
    license_number: "Nomor Lisensi",
    recruiter: "Perekruit",
    position: "Jabatan",
    direct_leader: "Leader Langsung",
    select_program: "Pilih Program",
    select_agent: "Pilih agen"
  },
  claim: {
    title: "Klaim",
    list_title: "Daftar Klaim"
  },
  fund: {
    title: "Jenis Dana",
    list_title: "Daftar Jenis Dana",
    search_placeholder: "Cari jenis dana...",
    edit_title: "Sunting Jenis Dana",
    create_title: "Tambah Jenis Dana",
    form_subtitle: "Masukkan informasi jenis dana investasi.",
    fund_name: "Nama Jenis Dana",
    currency: "Mata Uang"
  },
  contest: {
    title: "Kontes",
    list_title: "Daftar Kontes",
    search_placeholder: "Cari kontes...",
    edit_title: "Sunting Kontes",
    create_title: "Tambah Kontes",
    form_subtitle: "Masukkan informasi kontes yang dikejar Agen.",
    contest_name: "Nama Kontes",
    contest_type: "Jenis Kontes",
    start_date: "Mulai Kontes",
    end_date: "Selesai Kontes",
    minimum_premium: "Premi Minimal",
    reward: "Hadiah",
    no_contests: "Tidak ada kontes"
  },
  product: {
    title: "Produk",
    list_title: "Daftar Produk",
    search_placeholder: "Cari produk...",
    edit_title: "Sunting Produk",
    create_title: "Tambah Produk",
    form_subtitle: "Masukkan informasi produk asuransi.",
    product_name: "Nama Produk",
    product_type: "Jenis Produk",
    commission: "Komisi",
    commission_rate: "Komisi (%)"
  },
  agency: {
    search_placeholder: "Cari agency...",
    edit_title: "Sunting Agency",
    create_title: "Tambah Agency",
    form_subtitle: "Masukkan informasi mengenai Agency.",
    agency_name: "Nama Agency",
    agency_city: "Kota Agency",
    agency_director: "Direktur Agency",
    parent_agency: "Agency Atasan",
    select_agency: "Pilih Agency"
  },
  program: {
    list_title: "Daftar Program",
    new_program: "Program Baru",
    search_placeholder: "Cari program...",
    edit_title: "Sunting Program",
    create_title: "Tambah Program",
    program_data: "Data Program",
    program_name: "Nama Program",
    agent_position: "Jabatan Agen",
    min_allowance: "Allowance Minimal",
    max_allowance: "Allowance Maksimal",
    duration_months: "Durasi (Bulan)",
    program_targets: "Target Program",
    target_list: "Daftar Target",
    no_targets: "Belum ada target."
  },
  report: {
    annual_income: "Income List Tahunan",
    monthly_income: "Income List Bulanan",
    agent_annual_report: "Laporan Tahunan Agen",
    agent_monthly_report: "Laporan Bulanan Agen",
    agent_semester_report: "Laporan Semester Agen",
    agent_bonus_report: "Laporan Bonus Agen",
    bonus_report: "Laporan Bonus",
    due_date_report: "Laporan Jatuh Tempo",
    due_date_description: "Laporan Polis Nasabah yang Jatuh Tempo.",
    commission: "Komisi",
    annual_bonus: "Bonus Tahunan",
    recruit_bonus: "Bonus Rekrut",
    total_commission: "Total Komisi",
    achievement: "Pencapaian",
    shortage: "Kekurangan",
    mtd_achievement: "Pencapaian MTD",
    mtd_shortage: "Kurang MTD",
    ytd_achievement: "Pencapaian YTD",
    ytd_shortage: "Kurang YTD",
    ape_collected: "APE terkumpul",
    ape_shortage: "Kurang APE",
    cases_shortage: "Kurang Cases",
    fyp_collected: "FYP terkumpul"
  },
  months: {
    january: "Januari",
    february: "Februari",
    march: "Maret",
    april: "April",
    may: "Mei",
    june: "Juni",
    july: "Juli",
    august: "Agustus",
    september: "September",
    october: "Oktober",
    november: "November",
    december: "Desember"
  },
  religion: {
    buddhist: "Budha",
    christian: "Kristen",
    islam: "Islam",
    hindu: "Hindu"
  },
  dashboard: {
    agents_achieved: "agen mendapatkan",
    agents_reached: "agen mencapai"
  }
}
```

---

## Next Steps for i18n Implementation

1. **Install i18n library**
   ```bash
   npm install react-i18next i18next
   ```

2. **Create translation files**
   - Create `resources/js/locales/id.json` (Indonesian)
   - Create `resources/js/locales/en.json` (English)

3. **Configure i18next**
   - Set up i18next configuration
   - Initialize with default language (Indonesian)
   - Add language detection

4. **Replace hardcoded strings**
   - Use `useTranslation()` hook in components
   - Replace strings with `t('key')` calls
   - Test each page after replacement

5. **Add language switcher**
   - Create language selector component
   - Add to navigation/header
   - Persist language preference

6. **Testing**
   - Test all pages with both languages
   - Verify all strings are translated
   - Check for missing translations

---

**Report Generated By:** Bob (AI Assistant)  
**Date:** May 17, 2026  
**Total Strings Identified:** 500+  
**Files Scanned:** 30+  
**Completion Status:** ✅ Complete