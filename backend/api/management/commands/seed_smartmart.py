import random
import uuid
from decimal import Decimal
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import transaction

from api.models import (
    User, CustomerProfile, StaffProfile, Department, Aisle, Shelf,
    Supplier, Product, PurchaseOrder, PurchaseOrderItem,
    Transaction, TransactionItem, OnlineOrder, OrderItem,
    Payment, Attendance, StaffTask, Notification, Offer, StoreActivity
)


class Command(BaseCommand):
    help = 'Seeds SmartMart database with realistic Indian supermarket ecosystem data'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING("Clearing existing SmartMart data..."))
        
        # Clear transactional data first
        Payment.objects.all().delete()
        OrderItem.objects.all().delete()
        OnlineOrder.objects.all().delete()
        TransactionItem.objects.all().delete()
        Transaction.objects.all().delete()
        PurchaseOrderItem.objects.all().delete()
        PurchaseOrder.objects.all().delete()
        StaffTask.objects.all().delete()
        Attendance.objects.all().delete()
        Notification.objects.all().delete()
        StoreActivity.objects.all().delete()
        Offer.objects.all().delete()
        Product.objects.all().delete()
        Shelf.objects.all().delete()
        Aisle.objects.all().delete()
        Supplier.objects.all().delete()
        CustomerProfile.objects.all().delete()
        StaffProfile.objects.all().delete()
        Department.objects.all().delete()
        User.objects.all().delete()

        self.stdout.write(self.style.SUCCESS("Starting database seeding..."))

        # 1. Create Core Role Users
        self.stdout.write("1/8 Creating Core Demo Users...")
        admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@smartmart.local',
            password='adminpassword123',
            first_name='Ananya',
            last_name='Deshmukh',
            role='ADMIN',
            phone='+91 99887 76655'
        )

        cashier_user = User.objects.create_user(
            username='cashier',
            email='cashier@smartmart.local',
            password='cashierpassword123',
            first_name='Vikram',
            last_name='Singhania',
            role='CASHIER',
            phone='+91 98112 34567'
        )

        staff_user = User.objects.create_user(
            username='staff',
            email='staff@smartmart.local',
            password='staffpassword123',
            first_name='Rahul',
            last_name='Sharma',
            role='STAFF',
            phone='+91 98765 12340'
        )

        customer_user = User.objects.create_user(
            username='customer',
            email='customer@smartmart.local',
            password='customerpassword123',
            first_name='Pooja',
            last_name='Verma',
            role='CUSTOMER',
            phone='+91 98765 43210'
        )

        CustomerProfile.objects.create(
            user=customer_user,
            phone='+91 98765 43210',
            address='Flat 402, Green Glen Heights, Bellandur, Bengaluru - 560103',
            loyalty_points=340,
            wallet_balance=1250.00
        )

        # 2. Departments, Aisles, Shelves
        self.stdout.write("2/8 Creating 12+ Departments, Aisles & Shelves...")
        dept_data = [
            {'name': 'Grocery & Staples', 'code': 'GROC', 'floor': 'Ground Floor', 'icon': 'shopping-bag', 'color': '#3B82F6', 'desc': 'Atta, Rice, Pulses, Spices, Ghee & Cooking Oils'},
            {'name': 'Dairy & Chilled Products', 'code': 'DAIR', 'floor': 'Ground Floor', 'icon': 'milk', 'color': '#06B6D4', 'desc': 'Milk, Paneer, Butter, Curd, Cheese & Flavoured Drinks'},
            {'name': 'Bakery & Deli', 'code': 'BAKE', 'floor': 'Ground Floor', 'icon': 'cake', 'color': '#F59E0B', 'desc': 'Fresh Breads, Buns, Cookies, Cakes & Pastries'},
            {'name': 'Beverages & Juices', 'code': 'BEVE', 'floor': 'Ground Floor', 'icon': 'coffee', 'color': '#10B981', 'desc': 'Tea, Coffee, Soft Drinks, Fruit Juices & Energy Drinks'},
            {'name': 'Snacks & Confectionery', 'code': 'SNAC', 'floor': 'Ground Floor', 'icon': 'cookie', 'color': '#EC4899', 'desc': 'Namkeen, Biscuits, Chips, Chocolates & Sweets'},
            {'name': 'Personal Care & Beauty', 'code': 'PERS', 'floor': '1st Floor', 'icon': 'sparkles', 'color': '#8B5CF6', 'desc': 'Soaps, Shampoos, Skincare, Hair Oils & Dental Care'},
            {'name': 'Home Care & Detergents', 'code': 'HOME', 'floor': '1st Floor', 'icon': 'home', 'color': '#14B8A6', 'desc': 'Washing Powders, Dishwashing Liquids & Surface Cleaners'},
            {'name': 'Cleaning & Hygiene', 'code': 'CLEA', 'floor': '1st Floor', 'icon': 'shield', 'color': '#64748B', 'desc': 'Mops, Disinfectants, Mosquito Repellents & Paper Towels'},
            {'name': 'Electronics & Appliances', 'code': 'ELEC', 'floor': '2nd Floor', 'icon': 'tv', 'color': '#6366F1', 'desc': 'Kitchen Mixers, Kettles, Irons, Smart Gadgets & Audio'},
            {'name': 'Apparel & Clothing', 'code': 'CLOTH', 'floor': '2nd Floor', 'icon': 'shirt', 'color': '#F97316', 'desc': 'Men, Women & Kids Daily Wear, Kurtas & Casuals'},
            {'name': 'Footwear & Bags', 'code': 'FOOT', 'floor': '2nd Floor', 'icon': 'footprints', 'color': '#A855F7', 'desc': 'Formal Shoes, Sandals, Slippers & Travel Bags'},
            {'name': 'Fresh Fruits & Vegetables', 'code': 'FRES', 'floor': 'Ground Floor', 'icon': 'apple', 'color': '#22C55E', 'desc': 'Farm-fresh Onions, Potatoes, Tomatoes, Apples & Greens'},
        ]

        departments = {}
        all_shelves = []
        aisle_counter = 1

        for d in dept_data:
            dept = Department.objects.create(
                name=d['name'],
                code=d['code'],
                floor=d['floor'],
                icon_name=d['icon'],
                theme_color=d['color'],
                description=d['desc']
            )
            departments[d['code']] = dept

            # Create 2 aisles per department
            for a_idx in range(1, 3):
                aisle = Aisle.objects.create(
                    department=dept,
                    aisle_number=aisle_counter,
                    name=f"{d['name'].split('&')[0].strip()} Row {a_idx}"
                )
                aisle_counter += 1

                # Create shelves A, B, C for each aisle
                for s_letter in ['Shelf A', 'Shelf B', 'Shelf C']:
                    shelf = Shelf.objects.create(
                        aisle=aisle,
                        shelf_code=s_letter,
                        level=random.randint(1, 3)
                    )
                    all_shelves.append(shelf)

        # Attach default staff user to Grocery
        StaffProfile.objects.create(
            user=staff_user,
            employee_id='SM1024',
            department=departments['GROC'],
            role_title='Senior Store Associate',
            shift='9 AM – 5 PM',
            status='Active'
        )

        StaffProfile.objects.create(
            user=cashier_user,
            employee_id='SM1002',
            department=departments['GROC'],
            role_title='Senior Billing Cashier',
            shift='8 AM – 4 PM',
            status='Active'
        )

        # 3. Suppliers (20+ Indian FMCG Companies)
        self.stdout.write("3/8 Creating 20+ Suppliers...")
        suppliers_data = [
            {'name': 'Gujarat Co-operative Milk Marketing Federation (Amul)', 'contact': 'Dr. R.S. Sodhi', 'email': 'sales@amul.coop', 'phone': '+91 2692 258506', 'cat': 'Dairy & Chilled'},
            {'name': 'Hindustan Unilever Limited (HUL)', 'contact': 'Nitin Paranjpe', 'email': 'institutional.sales@hul.com', 'phone': '+91 22 5043 0000', 'cat': 'Personal & Home Care'},
            {'name': 'ITC Limited - Foods Division', 'contact': 'Sanjiv Puri', 'email': 'supplychain@itc.in', 'phone': '+91 33 2288 9371', 'cat': 'Staples & Snacks'},
            {'name': 'Nestlé India Limited', 'contact': 'Suresh Narayanan', 'email': 'orders@nestle.in', 'phone': '+91 124 2341275', 'cat': 'Beverages & Dairy'},
            {'name': 'Britannia Industries Limited', 'contact': 'Varun Berry', 'email': 'distributors@britannia.co.in', 'phone': '+91 80 3768 7100', 'cat': 'Bakery & Dairy'},
            {'name': 'Tata Consumer Products Ltd', 'contact': 'Sunil D’Souza', 'email': 'sales@tataconsumer.com', 'phone': '+91 22 6665 8282', 'cat': 'Staples & Beverages'},
            {'name': 'Marico Limited', 'contact': 'Saugata Gupta', 'email': 'supply@marico.com', 'phone': '+91 22 6648 0480', 'cat': 'Edible Oils & Hair Care'},
            {'name': 'Dabur India Limited', 'contact': 'Mohit Malhotra', 'email': 'trade@dabur.com', 'phone': '+91 120 3982000', 'cat': 'Ayurvedic & Healthcare'},
            {'name': 'Godrej Consumer Products Ltd', 'contact': 'Sudhir Sitapati', 'email': 'sales@godrejcp.com', 'phone': '+91 22 2518 8010', 'cat': 'Home Care & Personal Care'},
            {'name': 'Procter & Gamble Hygiene & Health Care', 'contact': 'LV Vaidyanathan', 'email': 'pg.distributors@pg.com', 'phone': '+91 22 2826 6000', 'cat': 'Personal Care & Detergents'},
            {'name': 'Parle Products Private Limited', 'contact': 'Mayank Shah', 'email': 'orders@parle.biz', 'phone': '+91 22 6691 6911', 'cat': 'Biscuits & Confectionery'},
            {'name': 'Haldiram Snacks Private Limited', 'contact': 'Kamal Agarwal', 'email': 'trade@haldiram.com', 'phone': '+91 120 2400190', 'cat': 'Sweets & Namkeen'},
            {'name': 'Adani Wilmar Limited (Fortune)', 'contact': 'Angshu Mallick', 'email': 'fortune.care@adaniwilmar.in', 'phone': '+91 79 2645 5656', 'cat': 'Cooking Oils & Basmati Rice'},
            {'name': 'Mondelez India Foods Pvt Ltd (Cadbury)', 'contact': 'Deepak Iyer', 'email': 'cadbury.orders@mdlz.com', 'phone': '+91 22 4007 3100', 'cat': 'Chocolates & Biscuits'},
            {'name': 'Reckitt Benckiser India (Dettol, Lizol)', 'contact': 'Gaurav Jain', 'email': 'rb.india@reckitt.com', 'phone': '+91 124 4028000', 'cat': 'Disinfectants & Cleaning'},
            {'name': 'Colgate-Palmolive (India) Limited', 'contact': 'Prabha Narasimhan', 'email': 'colgate.care@colpal.com', 'phone': '+91 22 6709 5050', 'cat': 'Oral Care'},
            {'name': 'PepsiCo India Holdings Pvt Ltd', 'contact': 'Ahmed ElSheikh', 'email': 'orders@pepsico.com', 'phone': '+91 124 4407000', 'cat': 'Snacks & Beverages'},
            {'name': 'Coca-Cola India Private Limited', 'contact': 'Sanket Ray', 'email': 'india.orders@coca-cola.com', 'phone': '+91 124 2345241', 'cat': 'Beverages'},
            {'name': 'Wipro Enterprises (Consumer Care)', 'contact': 'Vineet Agrawal', 'email': 'sales@wiproconsumer.com', 'phone': '+91 80 2844 0011', 'cat': 'Personal Care & Soaps'},
            {'name': 'Havells India Limited', 'contact': 'Anil Rai Gupta', 'email': 'appliances@havells.com', 'phone': '+91 120 4771000', 'cat': 'Small Appliances'},
            {'name': 'Heritage Foods Limited', 'contact': 'Nara Bhuvaneswari', 'email': 'dairy@heritagefoods.in', 'phone': '+91 40 2339 1221', 'cat': 'Fresh Milk & Ghee'},
        ]

        suppliers = []
        for s in suppliers_data:
            sup = Supplier.objects.create(
                name=s['name'],
                contact_person=s['contact'],
                email=s['email'],
                phone=s['phone'],
                category=s['cat'],
                address='Industrial Area, Mumbai / Bengaluru / Delhi Hub',
                rating=round(random.uniform(4.3, 4.9), 1)
            )
            suppliers.append(sup)

        # 4. 300+ Products with realistic Indian brands, barcodes, and prices
        self.stdout.write("4/8 Creating 300+ Realistic Supermarket Products...")
        products_catalog = [
            # GROCERY & STAPLES (GROC)
            ('Aashirvaad Superior MP Shudh Chakki Atta 10kg', 'ITC Limited', 'GROC', 465, 495, '10 kg', 'Made from premium golden grains with zero maida.'),
            ('Aashirvaad Select Sharbati Atta 5kg', 'ITC Limited', 'GROC', 299, 330, '5 kg', '100% MP Sharbati wheat grains.'),
            ('India Gate Classic Basmati Rice 5kg', 'KRBL', 'GROC', 549, 625, '5 kg', 'Extra-long aged grain aromatic basmati.'),
            ('Daawat Rozana Super Basmati Rice 5kg', 'LT Foods', 'GROC', 380, 425, '5 kg', 'Aromatic slender grains for daily biryani & pulao.'),
            ('Fortune Sunlite Refined Sunflower Oil 5L Can', 'Adani Wilmar', 'GROC', 645, 720, '5 L', 'Light, healthy oil rich in Vitamin E.'),
            ('Saffola Gold Pro Healthy Heart Edible Oil 5L', 'Marico', 'GROC', 785, 890, '5 L', 'Blend of rice bran and sunflower oil with antioxidants.'),
            ('Tata Sampann Unpolished Toor Dal 1kg', 'Tata Consumer', 'GROC', 172, 195, '1 kg', 'Naturally unpolished protein-rich pigeon peas.'),
            ('Tata Sampann Moong Dal Chana Dal Combo 2kg', 'Tata Consumer', 'GROC', 280, 310, '2 kg', 'Wholesome unpolished lentils.'),
            ('Tata Salt Vacuum Evaporated Iodized 1kg', 'Tata Consumer', 'GROC', 28, 30, '1 kg', 'Desh Ka Namak with essential iodine.'),
            ('Catch Super Garam Masala Powder 100g', 'Dharampal Satyapal', 'GROC', 82, 95, '100 g', 'Aromatic blend of ground spices.'),
            ('Everest Tikhalal Chilli Powder 500g', 'Everest Spices', 'GROC', 210, 240, '500 g', 'Rich natural red colour and spicy kick.'),
            ('Everest Turmeric Powder Haldi 500g', 'Everest Spices', 'GROC', 145, 165, '500 g', 'Pure ground Salem turmeric.'),
            ('Madhur Pure & Hygienic Sugar 5kg', 'Shree Renuka', 'GROC', 245, 275, '5 kg', 'Sulphur-free crystal white sugar.'),
            ('Fortune Kachi Ghani Mustard Oil 1L Pouch', 'Adani Wilmar', 'GROC', 142, 160, '1 L', 'Cold-pressed pungent mustard oil.'),
            ('Pillsbury Chakki Fresh Atta 5kg', 'General Mills', 'GROC', 235, 260, '5 kg', 'Soft rotis that stay fresh for 6 hours.'),
            ('Catch Cumin Seeds Jeera Whole 200g', 'Dharampal Satyapal', 'GROC', 115, 130, '200 g', 'Crisp whole aromatic jeera seeds.'),
            ('Tata Sampann Organic Kabuli Chana 500g', 'Tata Consumer', 'GROC', 110, 125, '500 g', 'Pesticide-free large chickpeas.'),
            ('Dhara Filtered Groundnut Oil 1L Pouch', 'Mother Dairy', 'GROC', 185, 205, '1 L', 'Traditional nutty flavour groundnut oil.'),
            ('Amul Pure Ghee 1L Tin', 'Amul', 'GROC', 610, 650, '1 L', 'Granular golden desi cow ghee aroma.'),
            ('Patanjali Cow Ghee 1L Tetrapack', 'Patanjali', 'GROC', 585, 620, '1 L', 'Nutritious golden pure cow milk fat.'),

            # DAIRY & CHILLED (DAIR)
            ('Amul Gold Full Cream Fresh Milk 1L Pouch', 'Amul', 'DAIR', 66, 68, '1 L', 'Homogenized rich 6.0% fat milk.'),
            ('Amul Taaza Toned Milk 1L Tetrapack', 'Amul', 'DAIR', 74, 78, '1 L', 'Long shelf-life UHT toned milk.'),
            ('Amul Salted Butter 500g Carton', 'Amul', 'DAIR', 275, 285, '500 g', 'Utterly butterly delicious classic butter.'),
            ('Amul Malai Fresh Paneer 200g Pack', 'Amul', 'DAIR', 92, 98, '200 g', 'Soft and creamy block of fresh cottage cheese.'),
            ('Mother Dairy Classic Dahi 400g Cup', 'Mother Dairy', 'DAIR', 35, 38, '400 g', 'Thick, creamy curd with live cultures.'),
            ('Amul Cheese Slices 200g (10 Slices)', 'Amul', 'DAIR', 135, 145, '200 g', 'Melt-in-mouth processed cheese slices.'),
            ('Britannia Cheese Block Processed 400g', 'Britannia', 'DAIR', 260, 285, '400 g', 'Cheddar blend rich dairy block.'),
            ('Epigamia Greek Yogurt Blueberry 120g', 'Epigamia', 'DAIR', 60, 65, '120 g', 'High-protein real fruit Greek yogurt.'),
            ('Milky Mist Paneer Fresh Cubes 500g', 'Milky Mist', 'DAIR', 225, 245, '500 g', 'Diced succulent malai paneer.'),
            ('Amul Kool Kesar Badam Milk Can 180ml', 'Amul', 'DAIR', 30, 35, '180 ml', 'Chilled flavoured drink with real saffron and nuts.'),
            ('Mother Dairy Cow Milk 500ml Pouch', 'Mother Dairy', 'DAIR', 28, 30, '500 ml', 'Easy to digest pure cow milk.'),
            ('Gowardhan Desi Cow Butter 100g', 'Parag Milk Foods', 'DAIR', 65, 70, '100 g', 'Pure white traditional churned butter.'),

            # BAKERY & DELI (BAKE)
            ('Britannia 100% Whole Wheat Bread 400g', 'Britannia', 'BAKE', 50, 55, '400 g', 'High fibre healthy whole wheat sliced loaf.'),
            ('English Oven Sandwich Bread 400g', 'English Oven', 'BAKE', 45, 50, '400 g', 'Soft extra-large slices for grilled sandwiches.'),
            ('Britannia Fruit Cake Slices 120g', 'Britannia', 'BAKE', 40, 45, '120 g', 'Moist cake loaded with candied fruit bits.'),
            ('Modern White Sliced Bread 400g', 'Modern Foods', 'BAKE', 38, 42, '400 g', 'Soft everyday white bread with crust.'),
            ('Harvest Gold Multigrain Bread 400g', 'Harvest Gold', 'BAKE', 55, 60, '400 g', 'Loaded with oats, flax, sunflower & sesame.'),
            ('English Oven Burger Buns (Pack of 4)', 'English Oven', 'BAKE', 40, 45, 'Pack of 4', 'Sesame-topped soft brioche burger buns.'),
            ('Britannia Rusk Toastea Crispy 400g', 'Britannia', 'BAKE', 60, 65, '400 g', 'Elaichi flavoured golden baked crunchy rusk.'),

            # BEVERAGES (BEVE)
            ('Tata Tea Gold Leaf & Dust 500g Jar', 'Tata Consumer', 'BEVE', 315, 360, '500 g', 'Exquisite blend of CTC and long leaves.'),
            ('Red Label Natural Care Tea 1kg Pack', 'HUL', 'BEVE', 510, 575, '1 kg', 'Enhanced with 5 Ayurvedic ingredients: Ashwagandha & Tulsi.'),
            ('Nescafé Classic Instant Coffee Powder 200g Jar', 'Nestlé India', 'BEVE', 575, 620, '200 g', '100% pure Robusta aromatic coffee.'),
            ('Bru Instant Coffee Chicory Mix 200g Pouch', 'HUL', 'BEVE', 340, 375, '200 g', 'South Indian aroma roast and chicory.'),
            ('Tropicana 100% Orange Juice 1L Tetrapack', 'PepsiCo', 'BEVE', 125, 140, '1 L', 'No added sugar pure orange goodness.'),
            ('Real Fruit Power Mixed Fruit Juice 1L', 'Dabur India', 'BEVE', 115, 130, '1 L', 'Blended with 9 delicious tropical fruits.'),
            ('Coca-Cola Original Taste 750ml Bottle', 'Coca-Cola', 'BEVE', 40, 45, '750 ml', 'Classic carbonated soft drink.'),
            ('Thums Up Charged Carbonated Drink 750ml', 'Coca-Cola', 'BEVE', 40, 45, '750 ml', 'Taste the thunder strong fizzy cola.'),
            ('Bisleri Mineral Water 5L Dispenser Jar', 'Bisleri', 'BEVE', 75, 80, '5 L', '10-step purified mineral hydration with ozonisation.'),
            ('Red Bull Energy Drink Can 250ml', 'Red Bull', 'BEVE', 125, 130, '250 ml', 'Vitalizes body and mind with taurine.'),
            ('Bournvita Chocolate Health Nutrition Drink 1kg', 'Mondelez', 'BEVE', 415, 455, '1 kg', 'Inner strength formula with vitamin D & calcium.'),
            ('Horlicks Classic Malt Health Drink 1kg Jar', 'HUL', 'BEVE', 425, 465, '1 kg', 'Clinically proven for more bone and muscle power.'),

            # SNACKS & CONFECTIONERY (SNAC)
            ('Maggi 2-Minute Masala Noodles (Pack of 12)', 'Nestlé India', 'SNAC', 168, 180, '840 g', 'India’s favourite quick spicy noodle snack.'),
            ('Haldiram’s Nagpur Aloo Bhujia 1kg', 'Haldiram', 'SNAC', 230, 260, '1 kg', 'Crispy spiced potato gram flour sticks.'),
            ('Haldiram’s Khatta Meetha Namkeen 400g', 'Haldiram', 'SNAC', 95, 110, '400 g', 'Sweet and sour tangy mixture of puffed rice & nuts.'),
            ('Lay’s India’s Magic Masala Potato Chips 90g', 'PepsiCo', 'SNAC', 35, 40, '90 g', 'Crunchy potato ridges with Indian blend spices.'),
            ('Kurkure Masala Munch Crunchy Snack 90g', 'PepsiCo', 'SNAC', 20, 20, '90 g', 'Tedha hai par mera hai crispy corn curls.'),
            ('Cadbury Dairy Milk Silk Chocolate Bar 150g', 'Mondelez', 'SNAC', 175, 190, '150 g', 'Silky, smooth milk chocolate that melts in mouth.'),
            ('Cadbury Celebrations Premium Gift Box 280g', 'Mondelez', 'SNAC', 260, 299, '280 g', 'Festive assortment of Dairy Milk, 5 Star & Gems.'),
            ('Parle-G Gold Glucose Biscuits 1kg Family Pack', 'Parle Products', 'SNAC', 125, 140, '1 kg', 'Iconic Indian tea-dunking crunchy biscuits.'),
            ('Britannia Good Day Cashew Almond Cookies 600g', 'Britannia', 'SNAC', 145, 160, '600 g', 'Butter cookies embedded with rich dry fruits.'),
            ('Oreo Original Vanilla Cream Sandwich Biscuits 300g', 'Mondelez', 'SNAC', 85, 95, '300 g', 'Dark chocolate biscuits with vanilla cream twist.'),
            ('Sunfeast Dark Fantasy Choco Fills 300g Box', 'ITC Limited', 'SNAC', 135, 150, '300 g', 'Crisp cookie crust filled with molten chocolate.'),
            ('Ferrero Rocher Hazelnut Chocolate Box of 16', 'Ferrero', 'SNAC', 545, 599, '200 g', 'Crispy wafer ball layered with whole hazelnut and milk chocolate.'),

            # PERSONAL CARE & BEAUTY (PERS)
            ('Dove Intense Repair Damage Therapy Shampoo 650ml', 'HUL', 'PERS', 499, 580, '650 ml', 'Fibre actives restore shine and reverse damage.'),
            ('Dove Daily Shine Hair Conditioner 180ml', 'HUL', 'PERS', 215, 250, '180 ml', 'Nutritive serum for silky smooth hair detangling.'),
            ('Dettol Original Germ Protection Bathing Soap (Pack of 5 x 125g)', 'Reckitt', 'PERS', 230, 260, '625 g', 'Trusted antiseptic antibacterial formula.'),
            ('Dove White Cream Beauty Bathing Bar (Pack of 4 x 100g)', 'HUL', 'PERS', 245, 275, '400 g', '1/4th moisturizing cream for glowing soft skin.'),
            ('Colgate Total Advanced Health Toothpaste 240g Combo', 'Colgate', 'PERS', 225, 260, '240 g', '12-hour antibacterial whole mouth protection.'),
            ('Sensodyne Repair & Protect Sensitive Toothpaste 100g', 'GSK Consumer', 'PERS', 220, 245, '100 g', 'NovaMin technology builds protective mineral layer.'),
            ('Parachute 100% Pure Coconut Hair Oil 500ml Bottle', 'Marico', 'PERS', 215, 240, '500 ml', 'Naturally filtered unadulterated edible grade oil.'),
            ('Nivea Soft Light Moisturizing Cream 200ml Tub', 'Beiersdorf', 'PERS', 270, 310, '200 ml', 'Quick absorbing Vitamin E and Jojoba oil lotion.'),
            ('Vaseline Intensive Care Deep Moisture Body Lotion 400ml', 'HUL', 'PERS', 310, 365, '400 ml', 'Micro-droplets of petroleum jelly lock hydration for 48h.'),
            ('Gillette Fusion ProGlide FlexBall Shaving Razor', 'P&G', 'PERS', 599, 699, '1 unit', '5 antifriction blades for effortless close contours.'),
            ('Himalaya Purifying Neem Face Wash 300ml Pump', 'Himalaya', 'PERS', 260, 295, '300 ml', 'Prevents acne and purifies with herbal neem and turmeric.'),
            ('Head & Shoulders Cool Menthol Anti-Dandruff Shampoo 650ml', 'P&G', 'PERS', 525, 600, '650 ml', '100% flake free scalp cooling sensation.'),

            # HOME CARE & CLEANING (HOME & CLEA)
            ('Surf Excel Matic Front Load Liquid Detergent 2L Pouch', 'HUL', 'HOME', 435, 490, '2 L', 'Faster stain removal for automatic washing machines.'),
            ('Ariel Matic Top Load Washing Powder 4kg Bag', 'P&G', 'HOME', 720, 830, '4 kg', 'Oxi-stain fighters eliminate tough collar grime.'),
            ('Comfort After Wash Fabric Conditioner Morning Fresh 2L', 'HUL', 'HOME', 399, 460, '2 L', 'Unbeatable shine, softness and long-lasting fragrance.'),
            ('Vim Lemon Dishwash Gel Super Value 2L Bottle', 'HUL', 'HOME', 375, 420, '2 L', '1 spoon cleans a sink full of oily cookware.'),
            ('Pril Lime Degreaser Liquid Dishwash 750ml', 'Henkel', 'HOME', 165, 185, '750 ml', 'Power molecules dissolve stubborn burnt grease.'),
            ('Lizol Citrus Floor Cleaner Disinfectant Liquid 2L', 'Reckitt', 'CLEA', 345, 395, '2 L', 'Kills 99.9% germs with sparkling clean tiles.'),
            ('Harpic Power Plus Original Disinfectant Toilet Cleaner 1L (Pack of 2)', 'Reckitt', 'CLEA', 330, 380, '2 L', '10x better stain removal than bleaching powder.'),
            ('Scotch-Brite Heavy Duty Scrub Sponge (Pack of 3)', '3M India', 'CLEA', 110, 125, 'Pack of 3', 'Durable non-scratch green synthetic abrasive.'),
            ('Goodknight Gold Flash Mosquito Liquid Refill (Pack of 4)', 'Godrej', 'CLEA', 285, 320, '180 ml', 'Instant dual vapour mode protects against dengue mosquitoes.'),
            ('Colin Glass and Surface Cleaner Spray 500ml', 'Reckitt', 'CLEA', 105, 120, '500 ml', 'Streak-free shine on mirrors and kitchen slabs.'),
            ('Origami Deluxe 3-Ply Toilet Tissue Rolls (Pack of 8)', 'Origami', 'CLEA', 220, 250, '8 rolls', '100% virgin pulp soft flushable rolls.'),

            # ELECTRONICS & APPLIANCES (ELEC)
            ('Philips Daily Collection 750W Mixer Grinder HL7756/00', 'Philips', 'ELEC', 2999, 3995, '1 unit', 'Tough motor with 3 stainless steel leakproof jars.'),
            ('Prestige Iris Electric Kettle 1.5L Stainless Steel', 'Prestige', 'ELEC', 749, 1195, '1 unit', 'Automatic cut-off with 360-degree swivel base.'),
            ('Havells 1000W Dry Iron Press with Teflon Soleplate', 'Havells', 'ELEC', 699, 995, '1 unit', 'Ergonomic handle and variable temperature fabric dial.'),
            ('boAt Airdopes 141 Bluetooth Wireless Earbuds', 'boAt', 'ELEC', 1199, 2990, '1 unit', '42 hours total playback with Beast mode low latency.'),
            ('Mi 20000mAh Power Bank 3i 18W Fast Charging', 'Xiaomi', 'ELEC', 1799, 2199, '1 unit', 'Dual input triple output metallic power bank.'),
            ('Bajaj DX 7 1000W Lightweight Dry Iron', 'Bajaj Electricals', 'ELEC', 649, 890, '1 unit', 'Non-stick coating with thermal fuse safety.'),
            ('Kent 16035 Instant Egg Boiler 360W', 'Kent RO', 'ELEC', 899, 1250, '1 unit', 'Boils up to 7 eggs to soft, medium, or hard in 3 mins.'),

            # APPAREL & FOOTWEAR (CLOTH & FOOT)
            ('Men 100% Combed Cotton Polo T-Shirt Navy Blue', 'SmartMart Basics', 'CLOTH', 499, 799, '1 unit', 'Breathable pique knit casual weekend wear.'),
            ('Women Floral Print Pure Cotton Straight Kurta', 'SmartMart Ethnic', 'CLOTH', 699, 1199, '1 unit', 'Mandarin collar daily workwear breathable fabric.'),
            ('Kids Unisex Cotton Track Pants Joggers (Pack of 2)', 'SmartMart Kids', 'CLOTH', 549, 899, 'Pack of 2', 'Elastic waistband with drawstring comfortable stretch.'),
            ('Men Cushioned Running Sports Shoes Grey/Volt', 'SmartMart Active', 'FOOT', 899, 1499, '1 pair', 'Shock-absorbing EVA sole with mesh breathable upper.'),
            ('Women Comfort Memory Foam Slip-on Casual Shoes', 'SmartMart Active', 'FOOT', 799, 1299, '1 pair', 'Orthopedic lightweight memory foam arch support.'),
            ('Unisex Water-Resistant Laptop Backpack 30L', 'SmartMart Gear', 'FOOT', 649, 1199, '1 unit', 'Multi-pocket padded sleeve with USB charging port.'),

            # FRESH PRODUCE (FRES)
            ('Farm Fresh Red Onions 5kg Net Bag', 'Fresh Direct', 'FRES', 160, 190, '5 kg', 'Grade-A Nashik pink onions.'),
            ('Fresh Hybrid Farm Potatoes 5kg Pack', 'Fresh Direct', 'FRES', 140, 165, '5 kg', 'Firm baking and frying potatoes.'),
            ('Country Farm Ripe Tomatoes 2kg Tray', 'Fresh Direct', 'FRES', 70, 85, '2 kg', 'Juicy local vine-ripened salad tomatoes.'),
            ('Shimla Royal Delicious Red Apples 1kg Pack', 'Fresh Direct', 'FRES', 170, 210, '1 kg', 'Crisp sweet apples from Himachal orchards.'),
            ('Robusta Fresh Bananas 1 Dozen', 'Fresh Direct', 'FRES', 55, 65, '12 units', 'Naturally ripened nutrient-rich bananas.'),
        ]

        # Generate ~320 products systematically by creating variants & brand additions
        created_products = []
        product_count = 0
        barcode_base = 8901030000000

        # First add the curated ones
        for item in products_catalog:
            name, brand, dept_code, price, mrp, unit, desc = item
            dept = departments.get(dept_code, departments['GROC'])
            aisles = list(dept.aisles.all())
            aisle = random.choice(aisles) if aisles else None
            shelf = random.choice(list(aisle.shelves.all())) if aisle else None

            barcode_base += 1
            p_sku = f"SM-PRD-{dept_code}-{1000 + product_count}"
            stock_qty = random.randint(12, 140)
            if product_count % 18 == 0:
                stock_qty = random.randint(2, 8) # Force low stock for realistic alerts!
            elif product_count % 35 == 0:
                stock_qty = 0 # Out of stock

            prod = Product.objects.create(
                sku=p_sku,
                barcode=str(barcode_base),
                name=name,
                brand=brand,
                department=dept,
                aisle=aisle,
                shelf=shelf,
                price=Decimal(str(price)),
                mrp=Decimal(str(mrp)),
                discount_percent=int(round(((mrp - price) / mrp) * 100)),
                stock=stock_qty,
                min_stock=15,
                unit=unit,
                image_url=f"https://picsum.photos/seed/smartmart_{product_count}/300/300",
                description=desc,
                rating=round(random.uniform(4.2, 4.9), 1),
                is_featured=(product_count % 7 == 0),
                is_bestseller=(product_count % 5 == 0),
                is_active=True
            )
            created_products.append(prod)
            product_count += 1

        # Now generate additional realistic FMCG product items to exceed 310+ products across all 12 departments
        sample_templates = [
            ("Premium Basmati Pulao Rice", "India Gate", "GROC", 90, 110, "1 kg"),
            ("Organic Brown Rice 1kg", "24 Mantra", "GROC", 125, 145, "1 kg"),
            ("Gram Flour Besan 1kg", "Tata Sampann", "GROC", 110, 125, "1 kg"),
            ("Fine Sooji Rawa 1kg", "Fortune", "GROC", 62, 70, "1 kg"),
            ("Roasted Vermicelli Sewai 400g", "Bambino", "GROC", 48, 55, "400 g"),
            ("Idli Dosa Wet Batter 1kg", "iD Fresh", "DAIR", 85, 95, "1 kg"),
            ("Natural Cow Curd 1kg Pouch", "Heritage", "DAIR", 75, 80, "1 kg"),
            ("Garlic Toast Bread Slices 200g", "English Oven", "BAKE", 65, 75, "200 g"),
            ("Green Tea Pure Tulsi 25 Dip Bags", "Organic India", "BEVE", 195, 230, "25 bags"),
            ("Cold Brew Black Coffee Can 250ml", "Sleepy Owl", "BEVE", 110, 125, "250 ml"),
            ("Bhujia Sev Spicy Gram Noodles 400g", "Bikaji", "SNAC", 115, 130, "400 g"),
            ("Moong Dal Salted Crunchy Snack 200g", "Haldiram", "SNAC", 55, 60, "200 g"),
            ("Nut Butter Crunchy Peanut Spread 350g", "Pintola", "SNAC", 185, 210, "350 g"),
            ("Anti-Pollution Charcoal Face Wash 150ml", "Garnier Men", "PERS", 195, 240, "150 ml"),
            ("Herbal Aloe Vera Gel Tube 150ml", "Patanjali", "PERS", 95, 110, "150 ml"),
            ("Neem & Clove Organic Toothpaste 150g", "Dabur Red", "PERS", 125, 140, "150 g"),
            ("All-in-One Dishwashing Tablets 30s", "Finish", "HOME", 520, 600, "Pack of 30"),
            ("Floor Disinfectant Herbal Pine 1L", "Nimyle", "CLEA", 140, 160, "1 L"),
            ("Garbage Bags Medium Roll 30 Bags", "Shalimar", "CLEA", 95, 110, "30 bags"),
            ("Stainless Steel Double Wall Water Bottle 750ml", "Milton", "ELEC", 499, 699, "1 unit"),
            ("Cordless Hair Clipper Trimmer USB", "Nova", "ELEC", 649, 999, "1 unit"),
            ("Cotton Solid Crew Socks (Pack of 3)", "SmartMart Basics", "CLOTH", 199, 299, "Pack of 3"),
            ("Orthopedic Comfort Bathroom Slippers", "Relaxo Flite", "FOOT", 249, 349, "1 pair"),
            ("Green Seedless Grapes 500g Box", "Fresh Direct", "FRES", 85, 110, "500 g"),
            ("Fresh Sweet Golden Corn (Pack of 2)", "Fresh Direct", "FRES", 40, 50, "Pack of 2"),
        ]

        for rep in range(11):
            for t_name, t_brand, t_dept, t_p, t_m, t_u in sample_templates:
                dept = departments.get(t_dept, departments['GROC'])
                aisles = list(dept.aisles.all())
                aisle = random.choice(aisles) if aisles else None
                shelf = random.choice(list(aisle.shelves.all())) if aisle else None

                barcode_base += 1
                price_var = Decimal(str(t_p + (rep * 3)))
                mrp_var = Decimal(str(t_m + (rep * 4)))
                stock_qty = random.randint(10, 120)
                if product_count % 16 == 0:
                    stock_qty = random.randint(1, 5) # Low stock
                elif product_count % 42 == 0:
                    stock_qty = 0 # Out of stock

                p = Product.objects.create(
                    sku=f"SM-PRD-{t_dept}-{2000 + product_count}",
                    barcode=str(barcode_base),
                    name=f"{t_name} {f'Series {rep+1}' if rep > 0 else ''}".strip(),
                    brand=t_brand,
                    department=dept,
                    aisle=aisle,
                    shelf=shelf,
                    price=price_var,
                    mrp=mrp_var,
                    discount_percent=int(round(((mrp_var - price_var) / mrp_var) * 100)),
                    stock=stock_qty,
                    min_stock=15,
                    unit=t_u,
                    image_url=f"https://picsum.photos/seed/sm_{product_count}/300/300",
                    description=f"Authentic {t_brand} supermarket grocery selection with high quality standards.",
                    rating=round(random.uniform(4.0, 4.9), 1),
                    is_featured=(product_count % 8 == 0),
                    is_bestseller=(product_count % 6 == 0),
                    is_active=True
                )
                created_products.append(p)
                product_count += 1

        self.stdout.write(self.style.SUCCESS(f"Created {len(created_products)} Products across {len(departments)} Departments."))

        # 5. Create 60+ Staff Members with shifts and attendance
        self.stdout.write("5/8 Creating 60+ Staff Members across shifts...")
        first_names = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Advaith', 'Aaryan', 'Dhruv', 'Kabir', 'Rishi', 'Kian', 'Diya', 'Saanvi', 'Ananya', 'Aadhya', 'Pari', 'Anvi', 'Navya', 'Myra', 'Ira', 'Avani', 'Riya', 'Sara', 'Meera', 'Sneha', 'Tanvi']
        last_names = ['Sharma', 'Verma', 'Patel', 'Reddy', 'Mehta', 'Nair', 'Iyer', 'Deshmukh', 'Kulkarni', 'Joshi', 'Chopra', 'Malhotra', 'Gupta', 'Bansal', 'Bhatia', 'Saxena', 'Kapoor', 'Menon', 'Rao', 'Pillai']

        shifts = ['6 AM – 2 PM (Morning)', '9 AM – 5 PM (General)', '1 PM – 9 PM (Evening)', '2 PM – 10 PM (Closing)']
        roles_list = ['Store Associate', 'Inventory Specialist', 'Section Supervisor', 'Customer Assistant', 'Department Lead']

        all_staff_users = [staff_user, cashier_user]
        today_date = timezone.now().date()

        for idx in range(1, 62):
            fname = random.choice(first_names)
            lname = random.choice(last_names)
            uname = f"staff_{idx}"
            s_user = User.objects.create_user(
                username=uname,
                email=f"{uname}@smartmart.local",
                password="staffpassword123",
                first_name=fname,
                last_name=lname,
                role='STAFF',
                phone=f"+91 {random.randint(91000, 99999)} {random.randint(10000, 99999)}"
            )
            dept = random.choice(list(departments.values()))
            emp_id = f"SM{2000 + idx}"
            shift = random.choice(shifts)

            StaffProfile.objects.create(
                user=s_user,
                employee_id=emp_id,
                department=dept,
                role_title=random.choice(roles_list),
                shift=shift,
                status='Active'
            )
            all_staff_users.append(s_user)

            # Attendance records
            # 80% present today
            is_present = random.random() < 0.85
            if is_present:
                in_time = datetime.strptime(f"0{random.randint(8,9)}:{random.randint(10,55)}:00", "%H:%M:%S").time()
                Attendance.objects.create(
                    staff=s_user,
                    date=today_date,
                    check_in=in_time,
                    check_out=None,
                    total_hours=round(random.uniform(3.5, 7.5), 1),
                    status='PRESENT'
                )

        # 6. Create 1000+ Customers
        self.stdout.write("6/8 Creating 1,000+ Customers...")
        all_customers = [customer_user]
        cust_batch_users = []
        cust_batch_profiles = []

        cities = ['Bengaluru', 'Mumbai', 'Pune', 'Hyderabad', 'Chennai', 'Delhi NCR']

        for c_idx in range(1, 1020):
            fname = random.choice(first_names)
            lname = random.choice(last_names)
            c_uname = f"customer_{c_idx}"
            u = User(
                username=c_uname,
                email=f"{c_uname}@email.com",
                first_name=fname,
                last_name=lname,
                role='CUSTOMER',
                phone=f"+91 {random.randint(91000, 99999)} {random.randint(10000, 99999)}"
            )
            u.set_password("customerpass123")
            cust_batch_users.append(u)

        User.objects.bulk_create(cust_batch_users)
        saved_customers = list(User.objects.filter(role='CUSTOMER'))

        for sc in saved_customers:
            if sc.id == customer_user.id:
                continue
            city = random.choice(cities)
            cust_batch_profiles.append(CustomerProfile(
                user=sc,
                phone=sc.phone,
                address=f"Flat {random.randint(101, 1804)}, Tower {random.choice(['A','B','C'])}, Sector {random.randint(1,60)}, {city}",
                loyalty_points=random.randint(20, 950),
                wallet_balance=Decimal(str(random.choice([0, 150, 250, 500, 1000])))
            ))

        CustomerProfile.objects.bulk_create(cust_batch_profiles)
        self.stdout.write(self.style.SUCCESS(f"Created {len(saved_customers)} Customers."))

        # 7. 1,000+ POS Transactions & 500+ Online Orders
        self.stdout.write("7/8 Generating 1,000+ POS Transactions and 500+ Online Orders...")
        
        now = timezone.now()
        payment_modes = ['UPI', 'UPI', 'CARD', 'CASH']
        
        # Historical POS transactions over past 30 days
        with transaction.atomic():
            for t_idx in range(1050):
                days_ago = random.randint(0, 30)
                hours_ago = random.randint(0, 12)
                txn_time = now - timedelta(days=days_ago, hours=hours_ago, minutes=random.randint(0, 59))

                customer = random.choice(saved_customers)
                cashier = cashier_user
                invoice_no = f"SM-{(now - timedelta(days=days_ago)).strftime('%Y%m%d')}-{10000 + t_idx}"

                # Pick 2-6 random products
                basket_items = random.sample(created_products, random.randint(2, 6))
                subtotal = Decimal('0.00')

                txn_items_to_create = []
                for bp in basket_items:
                    qty = random.randint(1, 3)
                    item_sub = bp.price * qty
                    subtotal += item_sub
                    txn_items_to_create.append((bp, qty, bp.price, item_sub))

                tax = (subtotal * Decimal('0.05')).quantize(Decimal('0.01'))
                discount = Decimal('40.00') if subtotal > 800 else Decimal('0.00')
                total = max(Decimal('20.00'), subtotal + tax - discount)
                pmode = random.choice(payment_modes)

                txn = Transaction.objects.create(
                    invoice_number=invoice_no,
                    cashier=cashier,
                    customer=customer,
                    customer_phone=customer.phone or '+91 98765 43210',
                    subtotal=subtotal,
                    discount=discount,
                    tax=tax,
                    total=total,
                    payment_mode=pmode,
                    status='PAID',
                    created_at=txn_time
                )
                Transaction.objects.filter(id=txn.id).update(created_at=txn_time)

                for b_prod, b_qty, b_price, b_sub in txn_items_to_create:
                    TransactionItem.objects.create(
                        transaction=txn,
                        product=b_prod,
                        quantity=b_qty,
                        unit_price=b_price,
                        subtotal=b_sub
                    )

                Payment.objects.create(
                    reference_id=f"PAY-{uuid.uuid4().hex[:10].upper()}",
                    amount=total,
                    payment_method=f"POS - {pmode}",
                    status='SUCCESS',
                    transaction=txn,
                    created_at=txn_time
                )

        # 500+ Online Orders
        order_statuses = ['DELIVERED', 'DELIVERED', 'DELIVERED', 'OUT_FOR_DELIVERY', 'PACKED', 'PREPARING', 'CONFIRMED']
        with transaction.atomic():
            for o_idx in range(520):
                days_ago = random.randint(0, 20)
                order_time = now - timedelta(days=days_ago, hours=random.randint(1, 14), minutes=random.randint(0, 59))
                ord_status = 'DELIVERED' if days_ago > 1 else random.choice(order_statuses)

                customer = random.choice(saved_customers)
                ord_no = f"ORD-{order_time.strftime('%m%d')}-{1000 + o_idx}"

                basket_items = random.sample(created_products, random.randint(2, 5))
                subtotal = Decimal('0.00')
                ord_items_to_create = []

                for bp in basket_items:
                    qty = random.randint(1, 2)
                    item_sub = bp.price * qty
                    subtotal += item_sub
                    ord_items_to_create.append((bp, qty, bp.price, item_sub))

                del_fee = Decimal('0.00') if subtotal > 500 else Decimal('30.00')
                discount = Decimal('50.00') if subtotal > 1000 else Decimal('0.00')
                total = max(Decimal('50.00'), subtotal + del_fee - discount)

                order = OnlineOrder.objects.create(
                    order_number=ord_no,
                    customer=customer,
                    status=ord_status,
                    delivery_address=customer.customer_profile.address if hasattr(customer, 'customer_profile') else 'Skyline Residency, Bangalore',
                    delivery_slot='Standard Delivery (Today)',
                    subtotal=subtotal,
                    delivery_fee=del_fee,
                    discount=discount,
                    total=total,
                    payment_method='UPI',
                    payment_status='PAID',
                    created_at=order_time
                )
                OnlineOrder.objects.filter(id=order.id).update(created_at=order_time)

                for bp, bqty, bprice, bsub in ord_items_to_create:
                    OrderItem.objects.create(
                        order=order,
                        product=bp,
                        quantity=bqty,
                        unit_price=bprice,
                        subtotal=bsub
                    )

        self.stdout.write(self.style.SUCCESS("Generated 1,050 Transactions & 520 Online Orders."))

        # 8. Purchase Orders, Tasks, Notifications, Offers, Store Pulse Activity
        self.stdout.write("8/8 Seeding Purchase Orders, Staff Tasks, Offers & Live Pulse Activity...")
        
        # Purchase Orders with Suppliers
        for sup in suppliers[:8]:
            po_num = f"PO-{now.strftime('%Y%m')}-{random.randint(1000, 9999)}"
            po_status = random.choice(['PLACED', 'DISPATCHED', 'RECEIVED'])
            po = PurchaseOrder.objects.create(
                po_number=po_num,
                supplier=sup,
                status=po_status,
                total_amount=Decimal(str(random.randint(45000, 180000)))
            )
            sample_prods = random.sample(created_products, random.randint(3, 6))
            for sp in sample_prods:
                PurchaseOrderItem.objects.create(
                    purchase_order=po,
                    product=sp,
                    quantity=random.choice([50, 100, 200]),
                    unit_cost=sp.price * Decimal('0.70'),
                    total_cost=sp.price * Decimal('0.70') * 50
                )

        # Staff Tasks
        tasks_data = [
            ('Restock Aisle 4 Dairy Section', 'Replenish Amul Gold milk pouches and malai paneer blocks from cold storage.', 'DAIR', 'HIGH', 'IN_PROGRESS'),
            ('Check Grocery Rice Bags Expiry', 'Inspect batch tags on India Gate Basmati 5kg and Daawat Rozana bags.', 'GROC', 'MEDIUM', 'PENDING'),
            ('Update Shelf Stock Aisle 7 Personal Care', 'Re-align Dove Shampoos and Dettol soaps on eye-level Shelf B.', 'PERS', 'MEDIUM', 'COMPLETED'),
            ('Customer Assist at Express POS 3', 'Help queue manager during 5 PM rush hour at counter 3.', 'GROC', 'HIGH', 'IN_PROGRESS'),
            ('Clean Section B Spillage', 'Mop aisle 6 floor near juice cartons.', 'BEVE', 'CRITICAL', 'COMPLETED'),
            ('Receive Amul Truck Dispatch', 'Verify invoice delivery count of 20 crates of cow butter & curd.', 'DAIR', 'HIGH', 'PENDING'),
            ('Electronic Gadgets Demo Setup', 'Connect mixer grinders and kettles for interactive customer testing.', 'ELEC', 'LOW', 'PENDING'),
        ]

        for t_title, t_desc, t_dept_code, t_pri, t_stat in tasks_data:
            StaffTask.objects.create(
                title=t_title,
                description=t_desc,
                department=departments[t_dept_code],
                assigned_to=staff_user,
                priority=t_pri,
                status=t_stat,
                due_time='Today 5:30 PM'
            )

        # Promotional Offers
        offers_data = [
            ('FLAT 20% OFF on Personal Care', 'BEAUTY20', 20, departments['PERS'], 'Special discounts on shampoos, conditioners & skincare.', '#8B5CF6'),
            ('15% OFF Mega Grocery Staples', 'GROCERY15', 15, departments['GROC'], 'Savings on Atta, Basmati Rice, and Desi Ghee.', '#3B82F6'),
            ('Buy 2 Get 1 FREE on Snacks', 'SNACKFEST', 33, departments['SNAC'], 'Valid across Haldiram namkeens, chips & biscuits.', '#EC4899'),
            ('Summer Coolers: 25% OFF Juices', 'CHILL25', 25, departments['BEVE'], 'Refreshing deals on Real juices and cold brews.', '#10B981'),
        ]
        for off_title, off_code, off_disc, off_dept, off_desc, off_col in offers_data:
            Offer.objects.create(
                title=off_title,
                code=off_code,
                discount_percent=off_disc,
                department=off_dept,
                description=off_desc,
                valid_until='30 September',
                banner_color=off_col,
                is_active=True
            )

        # Notifications
        Notification.objects.create(
            user=customer_user,
            title="🔔 In-Store Bill Ready — Cashier #2",
            message="Your offline cart bill #SM-2026-88421 for ₹485 is ready. Tap to pay via UPI or Cash.",
            type='BILL',
            data_json='{"invoice_number": "SM-2026-88421", "total": "485.00", "status": "PENDING"}'
        )
        Notification.objects.create(
            user=customer_user,
            title="🚚 Online Order #ORD-0916-241 Out for Delivery",
            message="SmartMart delivery executive Ramesh is on the way. Expected delivery in 20 mins.",
            type='ORDER'
        )
        Notification.objects.create(
            user=None,
            title="⚡ Weekend Flash Offer Activated",
            message="Get flat ₹100 instant cashback on your store bill using SmartMart UPI.",
            type='OFFER'
        )

        # Store Activities
        activities = [
            ('INVENTORY', 'Inventory updated — Grocery & Staples (+120 items)', 'box'),
            ('INVENTORY', 'Low-stock alert — Amul Gold Milk (4 units left)', 'alert-triangle'),
            ('OFFLINE_BILL', 'Offline bill #SM-9021 generated at Counter 2 (₹485.00)', 'receipt'),
            ('ONLINE_ORDER', 'Online order #ORD-0916-88 placed by Priya M. (₹1,240.00)', 'shopping-bag'),
            ('STAFF_CHECKIN', 'Staff checked in — Rahul Sharma (SM1024, Grocery)', 'user-check'),
            ('PO_DELIVERY', 'Supplier delivery received from Gujarat Co-op (Amul)', 'truck'),
            ('OFFLINE_BILL', 'POS Payment confirmed via UPI (Google Pay) — ₹890.00', 'check-circle'),
            ('INVENTORY', 'Restocked Aisle 4 shelves with Britannia Good Day', 'package'),
        ]
        for a_type, a_desc, a_icon in activities:
            StoreActivity.objects.create(
                activity_type=a_type,
                description=a_desc,
                icon=a_icon
            )

        self.stdout.write(self.style.SUCCESS("=" * 60))
        self.stdout.write(self.style.SUCCESS("SMARTMART SEEDING COMPLETED SUCCESSFULLY!"))
        self.stdout.write(self.style.SUCCESS(f"Total Departments: {Department.objects.count()}"))
        self.stdout.write(self.style.SUCCESS(f"Total Products: {Product.objects.count()}"))
        self.stdout.write(self.style.SUCCESS(f"Total Staff: {StaffProfile.objects.count()}"))
        self.stdout.write(self.style.SUCCESS(f"Total Customers: {CustomerProfile.objects.count()}"))
        self.stdout.write(self.style.SUCCESS(f"Total Suppliers: {Supplier.objects.count()}"))
        self.stdout.write(self.style.SUCCESS(f"Total POS Transactions: {Transaction.objects.count()}"))
        self.stdout.write(self.style.SUCCESS(f"Total Online Orders: {OnlineOrder.objects.count()}"))
        self.stdout.write(self.style.SUCCESS("=" * 60))
