# DevStore

An e-commerce platform built with **Django**, **Inertia.js (React)**, **Vite**, and **Tailwind CSS**.  
Users can register as **Authors** (require admin approval) or **Viewers** (immediate access), list products with multiple images, leave reviews, and shop with a live cart sidebar.

---

## 🛠️ Tech Stack

- **Backend**: Django 5.2, Django REST (via Inertia),  
  • Authentication & email workflows via [django-allauth]
- **Frontend**: React (JSX) rendered by Inertia.js
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Database**: MySQL (or SQLite for dev)
- **Deployment**: Docker / Heroku / (your choice)

---

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 16+ & npm
- MySQL or SQLite

### Clone & Setup

```bash
git clone https://github.com/yourusername/devstore.git
cd devstore

# Python env
python -m venv venv
source venv/bin/activate    # Mac/Linux
venv\Scripts\activate       # Windows

# Install Python deps
pip install -r requirements.txt

# Install JS deps
npm install
