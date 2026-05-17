# Carlsson Insurance Portal

Carlsson Insurance Portal is a comprehensive hierarchical sales and commission management system built with **Laravel** and **React**. It is designed to handle complex insurance policy life cycles, agent hierarchies (multi-level), production tracking, and automated reporting for bonuses and allowances.

## 🔄 Latest changes (2026-05-17)

- Added dashboard design and implementation docs (see DASHBOARD_ARCHITECTURE.md and DASHBOARD_IMPLEMENTATION_PLAN.md).
- Documented PWA setup and verification flows (see PWA_SETUP_GUIDE.md).
- Internationalization improvements and verification reports (see I18N_SETUP.md and I18N_VERIFICATION_REPORT.md).
- Integrated notes for WatsonX service usage and extractor configuration (see WATSONX_SERVICE_USAGE.md and config/extractor.php).
- Various frontend and build updates (Vite, React 19, and new menu/data files under resources/js).


## 🚀 Key Features

### 🏢 Master Data Management

- **Hierarchical Agent System**: Manage agents with multi-level relationships (Leader, Team, Agency).
- **Customer & Policy Holders**: Centralized database for clients and insured individuals.
- **Products & Programs**: Configurable insurance products, riders, investment funds, and financing programs.
- **Agency & Contests**: Manage agency structures and sales contests (Bonanza, Sem-Consistent, etc.).

### 📄 Sales & Policy Administration

- **Policy Management**: Full CRUD for insurance policies.
- **OCR Automation**: Intelligent extraction of policy data from PDF documents using OCR, reducing manual entry.
- **Receipt Tracking**: Manage premium payments and billing cycles.

### 📊 Advanced Reporting Engine

- **Production Reports**: Detailed analysis of sales performance (FYP, APE, Cases).
- **Commission & Bonus Calculation**: Automated monthly, semester, and annual reports calculating:
    - Basic Commission
    - Overriding Commission (Leader/Agency levels)
    - Recruit Bonuses
    - Production Bonuses (MDRT, Super Achiever)
    - Allowance/Financing Calculations
- **Performance Optimized**: Uses advanced SQL optimization (CTEs and Request Caching) to handle heavy aggregations for annual reports without timeouts.
- **Operational Reports**: Birthday lists, Due Dates, and Policy Lapses.

## 🛠️ Tech Stack

### Backend

- **Framework**: Laravel 12
- **Database**: MySQL (Heavy use of raw SQL optimizations and pivot tables)
- **Authentication**: Laravel Fortify
- **PDF Processing**: `smalot/pdfparser`, `helgesverre/extractor`

### Frontend

- **Framework**: React 19
- **Bridge**: Inertia.js (Monolithic-like DX with SPA performance)
- **Styling**: Bootstrap 5, Sass
- **Build Tool**: Vite
- **Charts**: Chart.js, ApexCharts

## ⚙️ Usage & Setup

### Prerequisites

- PHP >= 8.2
- Composer
- Node.js & NPM
- MySQL

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/richkingdom.git
    cd InsurancePortal
    ```

2.  **Install PHP Dependencies**

    ```bash
    composer install
    ```

3.  **Install Frontend Dependencies**

    ```bash
    npm install
    ```

4.  **Environment Setup**
    Copy the example environment file and configure your database credentials.

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

5.  **Database Migration**
    Run migrations to set up the schema.

    ```bash
    php artisan migrate
    ```

6.  **Build Assets**

    ```bash
    npm run build
    ```

7.  **Run Locally**
    Start the development server (requires two terminals or background processes).

    ```bash
    # Terminal 1: Laravel Server
    php artisan serve

    # Terminal 2: Vite Dev Server
    npm run dev
    ```

## 📑 Feature Highlights

- **OCR Policy Import**: Upload a policy PDF, and the system auto-fills the entry form with applicant details, premiums, and riders.
- **Excel Export**: Native support for exporting complex reports (like Monthly Income) to Excel.
- **Dynamic Dashboard**: Real-time overview of business performance.

## 📝 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
