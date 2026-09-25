# SmartMart — "Your Store. Digitally Connected."
## Complete Mobile Application Ecosystem Walkthrough

SmartMart is a digital supermarket ecosystem built from scratch connecting **Customers**, **Staff**, **Cashiers**, and **Admins** across physical in-store shopping and online e-commerce with unified real-time inventory, indoor supermarket map navigation, mobile POS billing, and actionable store analytics.

---

## 🚀 Live Application URLs

| Service | Address | Description | Status |
| :--- | :--- | :--- | :--- |
| **Mobile App (Expo Web / Mobile)** | [http://localhost:8081](http://localhost:8081) | Full mobile app with Phone Frame, Dynamic Island, and Light Glassmorphism | **LIVE & ACTIVE** |
| **Backend REST API (Django DRF)** | [http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/) | Connected relational database & business logic | **LIVE & ACTIVE** |

---

## 🎨 Visual Design System: Premium Light Glassmorphism

Built strictly according to design specifications:
- **Color Palette**: Pure White (`#FFFFFF`), Lavender Frost (`#F5F3FF`), Ice Blue (`#F0F7FF`), Soft Electric Indigo (`#6366F1`), Slate Navy text (`#0F172A`), Peach Accent (`#FB923C`), Mint Green (`#10B981`).
- **Glassmorphic Elements**: Frosted translucent glass cards (`rgba(255,255,255,0.85)`), layered soft shadows (`shadowColor: '#6366F1'`), subtle borders (`rgba(255,255,255,0.95)`), curved pill controls, and floating bottom navigation.
- **Mobile Container (`MobileFrame`)**: Renders an authentic mobile phone bezel with Dynamic Island, time, battery, 5G icons, and home bar on desktop, stretching seamlessly to 100% full screen on real mobile phones.

---

## 📱 Key Features & Role Experiences

```mermaid
graph TD
    subgraph "Top Bar: 1-Tap Quick Role Switcher"
        RS[Role Switcher Bar: Customer | Staff | Cashier | Admin]
    end

    subgraph "Role 1: Customer App"
        CH[Customer Home & Continuous Animated Hero]
        SO[Shop Online: 379 Products + Filters]
        SM[Shop In-Store: Interactive SVG Map & Route]
        CC[Cart & Express Checkout]
        OT[Order Tracking Timeline]
        CP[Profile & Digital Invoices]
    end

    subgraph "Role 2: Cashier App"
        CPOS[Mobile POS Register]
        BCS[Barcode Scanner Simulator]
        BILL[Bill Generator & Tax Calculator]
    end

    subgraph "Role 3: Staff App"
        SD[Staff Dashboard: Rahul Sharma SM1024]
        SA[Attendance Punch In/Out & Working Timer]
        ST[Task Board: Restocking & Ops]
        SSEC[Section Shelf Management]
    end

    subgraph "Role 4: Admin App"
        ACC[Admin Control Center & KPIs]
        SP[Store Pulse: Footfall 78%, Sales 89%]
        SI[SmartMart Insights Engine]
        INV[Inventory Health & Restock Modal]
        SUP[Supplier PO Workflow: Auto Stock Credit]
        REP[Executive CSV/PDF Reports]
    end

    RS --> CH & CPOS & SD & ACC
    CH --> SO & SM & CC & CP
    SO --> CC --> OT
    SM --> BCS
    CPOS --> BCS & BILL
    BILL -.->|Triggers In-App Notification| CP
    SD --> SA & ST & SSEC
    ACC --> SP & SI & INV & SUP & REP
```

---

## 🌟 Major Highlight Features

### 1. Continuous Animated Supermarket Hero (`AnimatedHero`)
Located on the Customer Home Screen:
- **Smooth Looping SVG Canvas**: Supermarket shelving with realistic colorful product packs.
- **Dynamic Moving Cart**: Glides back and forth horizontally with gentle bobbing.
- **Animated Red Laser Line**: Sweeps up and down across an optical barcode scanner.
- **Floating Metric Pills**: Live floating badges showing *"Live Indoor Sync Active"* and *"Shelf Navigation Ready"*.

### 2. Interactive Indoor Supermarket Floor Map (`IndoorStoreMap`)
A stylized indoor supermarket map (NOT Google Maps):
- **Zones Displayed**: Main Entrance (YOU ARE HERE), Checkout Lanes (1-8), Customer Service Helpdesk, Store Exit, Aisles 1 to 12, Shelves A, B, C.
- **Find in Store Routing**:
  - Tap *"Locate"* on any product (e.g. *Dove Shampoo* in Personal Care).
  - The map highlights the department, zooms, and animates a pulsing path line from Entrance through the central hallway into Aisle 8, Shelf B.
  - Step-by-step turn guidance: *"Turn right at Central Walkway &rarr; Aisle 8 (Shelf B)"*.

### 3. Realistic Barcode Scanner Simulator (`BarcodeScannerSimulator`)
- Holographic camera viewfinder with glowing target brackets.
- Continuously sweeping red scanning laser line.
- **Quick Preset Barcodes**: 1-tap buttons for fast testing (*Amul Gold Milk*, *Dove Shampoo*, *India Gate Basmati Rice*, *Maggi Masala*, *Tata Salt*, *Surf Excel*).
- Manual barcode input box for any custom SKU.

### 4. Connected Cashier POS & Digital Bill Flow
- **POS Register**: Rapid search, barcode addition, quantity multiplier, GST calculation.
- **Generate Bill**: Creates official `Transaction`, updates inventory stock in real-time.
- **Customer Alert**: Customer receives instant in-app alert *"🔔 In-Store Bill Ready"*.
- **Digital Payment Modal**: Simulated UPI (*Google Pay*, *PhonePe*, *Paytm*), Debit/Credit Card, or Cash at counter with animated *"PAYMENT SUCCESSFUL ✓"*.
- **Official Digital Invoice**: Itemized receipt with GST breakdown, cashier info, and **Print / Download PDF** triggers.

### 5. Staff Attendance & Task Management
- **One-Touch Punch In / Out**: Geo-fencing verification, live clock, active shift working hours ticker (*8h 07m*), and weekly attendance history table.
- **Interactive Task Board**: Task cards with priority badges (*Critical*, *High*, *Medium*) and status toggles (*Pending* &rarr; *In Progress* &rarr; *Completed*).

### 6. Admin Control Center & SmartMart Insights
- **KPI Counters**: Today's Revenue (₹8.42L), Customers (1,020), Transactions (1,050), Online Orders (520), Inventory Health (94%), Low Stock (18), Staff Present (47).
- **STORE PULSE**: Live animated progress rings for Footfall (78%), Sales (89%), Inventory Sync (94%), and Store Activity (71%).
- **SMARTMART INSIGHTS**: Dynamic actionable cards with direct CTAs (*"18 Products Below Threshold" &rarr; [Review Restocking Queue]*; *"Grocery: ₹2.86L Today" &rarr; [View Department Breakdown]*).
- **Supplier PO Receiving Workflow**: Marking a Purchase Order as *"Received"* automatically increments inventory stock across all ordered items!

---

## 📊 Database & Seeding Verification

The SQLite database (`backend/db.sqlite3`) was seeded with:
- **12 Departments**: Grocery & Staples, Dairy & Chilled, Bakery & Deli, Beverages, Snacks, Personal Care, Home Care, Cleaning, Electronics, Apparel, Footwear, Fresh Fruits & Vegetables.
- **379 Realistic FMCG Products**: Accurate Indian brands (Amul, Aashirvaad, Tata, Britannia, Dove, Surf Excel, Haldiram's, Dabur, Fortune, Maggi, etc.), prices, MRPs, barcodes, units, aisles, and shelves.
- **63 Staff Members**: Employee IDs `SM1001` - `SM2061` across all 4 shifts.
- **1,020 Customers**: Realistic Indian profiles, phone numbers, and addresses.
- **21 FMCG Suppliers**: Amul, HUL, ITC, Nestlé, Britannia, Tata Consumer, Marico, Dabur, Godrej, P&G, etc.
- **1,050 POS Transactions & 520 Online Orders**: Distributed over the past 30 days for authentic analytics and sales velocity trends.

---

## 🛠 How to Test the Project

1. Open **[http://localhost:8081](http://localhost:8081)** in your browser or on your phone via Expo Go.
2. Use the **Top Role Switcher Bar** to switch between **Customer**, **Cashier**, **Staff**, and **Admin** with a single tap.
3. Test the end-to-end connected flows:
   - **Cashier**: Open POS &rarr; Scan preset *Amul Gold Milk* &rarr; Click *Generate Bill*.
   - **Customer**: Notice bill banner &rarr; Click *Pay Online / Cash* &rarr; Select *UPI (Google Pay)* &rarr; Observe payment success & open digital invoice receipt!
   - **Admin**: Check *Inventory* to see the stock of *Amul Gold Milk* decremented by the sale. Open *Orders* &rarr; click *Receive Stock* on an Amul PO to see stock replenished!
   - **Staff**: Check *Attendance* &rarr; click *Check Out / Check In* & toggle priority tasks.
