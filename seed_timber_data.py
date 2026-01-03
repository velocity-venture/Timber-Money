#!/usr/bin/env python3
"""
Timber Money Database Seeder
Creates test users with realistic financial profiles for testing the Timber Money application.
"""

import os
import sys
import json
import random
from datetime import datetime, timedelta
from decimal import Decimal
import psycopg2
from psycopg2.extras import Json

# Get DATABASE_URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("ERROR: DATABASE_URL environment variable not set")
    sys.exit(1)

def connect_db():
    """Connect to PostgreSQL database"""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print(f"Failed to connect to database: {e}")
        sys.exit(1)

def create_test_users(cursor):
    """Create 3 test users with different financial profiles"""
    users = [
        {
            "id": "test-user-avalanche",
            "email": "avalanche@timbermoney.test",
            "first_name": "Alex",
            "last_name": "Avalanche",
            "subscription_plan": "pro_monthly",
            "subscription_status": "active",
        },
        {
            "id": "test-user-snowball",
            "email": "snowball@timbermoney.test",
            "first_name": "Sam",
            "last_name": "Snowball",
            "subscription_plan": "free",
            "subscription_status": "active",
        },
        {
            "id": "test-user-healthy",
            "email": "healthy@timbermoney.test",
            "first_name": "Harper",
            "last_name": "Healthy",
            "subscription_plan": "family_monthly",
            "subscription_status": "active",
        },
    ]
    
    print("Creating test users...")
    for user in users:
        cursor.execute("""
            INSERT INTO users (id, email, first_name, last_name, subscription_plan, subscription_status, created_at, updated_at)
            VALUES (%(id)s, %(email)s, %(first_name)s, %(last_name)s, %(subscription_plan)s, %(subscription_status)s, NOW(), NOW())
            ON CONFLICT (id) DO UPDATE SET
                email = EXCLUDED.email,
                first_name = EXCLUDED.first_name,
                last_name = EXCLUDED.last_name,
                subscription_plan = EXCLUDED.subscription_plan,
                subscription_status = EXCLUDED.subscription_status,
                updated_at = NOW()
        """, user)
    
    print(f"✅ Created {len(users)} test users")
    return users

def create_avalanche_profile(cursor, user_id):
    """Create high credit card debt profile (for Avalanche method testing)"""
    print(f"Creating Avalanche profile for {user_id}...")
    
    # High-interest credit card debts
    debts = [
        {"creditor": "Chase Sapphire", "balance": 8500, "apr": 24.99, "min_payment": 255, "type": "credit-card"},
        {"creditor": "Capital One Venture", "balance": 6200, "apr": 21.49, "min_payment": 186, "type": "credit-card"},
        {"creditor": "Discover It", "balance": 4800, "apr": 19.99, "min_payment": 144, "type": "credit-card"},
        {"creditor": "Citi Double Cash", "balance": 3200, "apr": 18.24, "min_payment": 96, "type": "credit-card"},
        {"creditor": "Personal Loan", "balance": 12000, "apr": 12.50, "min_payment": 350, "type": "loan"},
    ]
    
    for debt in debts:
        cursor.execute("""
            INSERT INTO debts (user_id, creditor, debt_type, current_balance, original_balance, apr, minimum_payment, due_date, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
        """, (user_id, debt["creditor"], debt["type"], debt["balance"], debt["balance"] * 1.5, debt["apr"], debt["min_payment"], random.randint(1, 28)))
    
    # Modest assets
    assets = [
        {"name": "Checking Account", "type": "savings", "value": 2500},
        {"name": "Emergency Fund", "type": "savings", "value": 1000},
        {"name": "2015 Honda Civic", "type": "vehicle", "value": 8000},
    ]
    
    for asset in assets:
        cursor.execute("""
            INSERT INTO assets (user_id, name, asset_type, current_value, created_at, updated_at)
            VALUES (%s, %s, %s, %s, NOW(), NOW())
        """, (user_id, asset["name"], asset["type"], asset["value"]))
    
    # Financial profile
    cursor.execute("""
        INSERT INTO financial_profiles (user_id, monthly_income, credit_score, updated_at)
        VALUES (%s, %s, %s, NOW())
        ON CONFLICT (user_id) DO UPDATE SET
            monthly_income = EXCLUDED.monthly_income,
            credit_score = EXCLUDED.credit_score,
            updated_at = NOW()
    """, (user_id, 4500, 620))
    
    print(f"✅ Created Avalanche profile: ${sum(d['balance'] for d in debts):,.0f} in debt")

def create_snowball_profile(cursor, user_id):
    """Create multiple small loans profile (for Snowball method testing)"""
    print(f"Creating Snowball profile for {user_id}...")
    
    # Multiple small debts
    debts = [
        {"creditor": "Medical Bill - Hospital", "balance": 850, "apr": 0, "min_payment": 50, "type": "loan"},
        {"creditor": "Store Credit - Best Buy", "balance": 1200, "apr": 26.99, "min_payment": 50, "type": "credit-card"},
        {"creditor": "Payday Loan", "balance": 500, "apr": 399.00, "min_payment": 150, "type": "loan"},
        {"creditor": "Credit Card - Target", "balance": 680, "apr": 22.99, "min_payment": 35, "type": "credit-card"},
        {"creditor": "Student Loan", "balance": 15000, "apr": 5.50, "min_payment": 180, "type": "loan"},
        {"creditor": "Car Loan", "balance": 8500, "apr": 7.25, "min_payment": 285, "type": "loan"},
        {"creditor": "Furniture Financing", "balance": 1800, "apr": 0, "min_payment": 75, "type": "loan"},
    ]
    
    for debt in debts:
        cursor.execute("""
            INSERT INTO debts (user_id, creditor, debt_type, current_balance, original_balance, apr, minimum_payment, due_date, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
        """, (user_id, debt["creditor"], debt["type"], debt["balance"], debt["balance"] * 1.3, debt["apr"], debt["min_payment"], random.randint(1, 28)))
    
    # Minimal assets
    assets = [
        {"name": "Checking Account", "type": "savings", "value": 800},
        {"name": "2018 Toyota Corolla", "type": "vehicle", "value": 12000},
    ]
    
    for asset in assets:
        cursor.execute("""
            INSERT INTO assets (user_id, name, asset_type, current_value, created_at, updated_at)
            VALUES (%s, %s, %s, %s, NOW(), NOW())
        """, (user_id, asset["name"], asset["type"], asset["value"]))
    
    # Financial profile
    cursor.execute("""
        INSERT INTO financial_profiles (user_id, monthly_income, credit_score, updated_at)
        VALUES (%s, %s, %s, NOW())
        ON CONFLICT (user_id) DO UPDATE SET
            monthly_income = EXCLUDED.monthly_income,
            credit_score = EXCLUDED.credit_score,
            updated_at = NOW()
    """, (user_id, 3200, 580))
    
    print(f"✅ Created Snowball profile: {len(debts)} debts totaling ${sum(d['balance'] for d in debts):,.0f}")

def create_healthy_profile(cursor, user_id):
    """Create healthy profile with high savings and document volume"""
    print(f"Creating Healthy profile for {user_id}...")
    
    # Minimal debt
    debts = [
        {"creditor": "Mortgage", "balance": 185000, "apr": 3.75, "min_payment": 1200, "type": "mortgage"},
        {"creditor": "Chase Sapphire Reserve", "balance": 1200, "apr": 18.99, "min_payment": 50, "type": "credit-card"},
    ]
    
    for debt in debts:
        cursor.execute("""
            INSERT INTO debts (user_id, creditor, debt_type, current_balance, original_balance, apr, minimum_payment, due_date, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
        """, (user_id, debt["creditor"], debt["type"], debt["balance"], debt["balance"] * 1.1, debt["apr"], debt["min_payment"], random.randint(1, 28)))
    
    # Strong assets
    assets = [
        {"name": "Primary Residence", "type": "property", "value": 350000},
        {"name": "401(k)", "type": "investment", "value": 125000},
        {"name": "Roth IRA", "type": "investment", "value": 45000},
        {"name": "Brokerage Account", "type": "investment", "value": 28000},
        {"name": "Emergency Fund", "type": "savings", "value": 25000},
        {"name": "Checking Account", "type": "savings", "value": 8500},
        {"name": "2022 Tesla Model 3", "type": "vehicle", "value": 38000},
    ]
    
    for asset in assets:
        cursor.execute("""
            INSERT INTO assets (user_id, name, asset_type, current_value, created_at, updated_at)
            VALUES (%s, %s, %s, %s, NOW(), NOW())
        """, (user_id, asset["name"], asset["type"], asset["value"]))
    
    # Financial profile
    cursor.execute("""
        INSERT INTO financial_profiles (user_id, monthly_income, credit_score, updated_at)
        VALUES (%s, %s, %s, NOW())
        ON CONFLICT (user_id) DO UPDATE SET
            monthly_income = EXCLUDED.monthly_income,
            credit_score = EXCLUDED.credit_score,
            updated_at = NOW()
    """, (user_id, 9500, 780))
    
    print(f"✅ Created Healthy profile: ${sum(a['value'] for a in assets):,.0f} in assets")

def create_mock_documents(cursor, user_id, count, profile_type):
    """Create mock document records with varying statuses"""
    print(f"Creating {count} mock documents for {user_id}...")
    
    doc_types = ["bank-statement", "credit-card", "loan", "receipt", "invoice", "income"]
    statuses = ["completed", "processing", "failed", "pending"]
    
    # Weight statuses based on profile
    if profile_type == "healthy":
        status_weights = [0.8, 0.1, 0.05, 0.05]  # Mostly completed
    elif profile_type == "snowball":
        status_weights = [0.6, 0.2, 0.15, 0.05]  # Some processing/failed
    else:
        status_weights = [0.7, 0.15, 0.1, 0.05]  # Balanced
    
    for i in range(count):
        doc_type = random.choice(doc_types)
        status = random.choices(statuses, weights=status_weights)[0]
        
        # Generate realistic file names
        date_str = (datetime.now() - timedelta(days=random.randint(1, 90))).strftime("%Y-%m-%d")
        file_names = {
            "bank-statement": f"bank_statement_{date_str}.pdf",
            "credit-card": f"cc_statement_{date_str}.pdf",
            "loan": f"loan_statement_{date_str}.pdf",
            "receipt": f"receipt_{date_str}.jpg",
            "invoice": f"invoice_{random.randint(1000, 9999)}.pdf",
            "income": f"paystub_{date_str}.pdf",
        }
        
        file_name = file_names.get(doc_type, f"document_{i}.pdf")
        
        # Generate mock analysis data for completed documents
        analysis_data = None
        if status == "completed":
            if doc_type in ["bank-statement", "credit-card"]:
                analysis_data = {
                    "total": round(random.uniform(500, 5000), 2),
                    "vendor": random.choice(["Chase Bank", "Wells Fargo", "Bank of America", "Capital One"]),
                    "period": {
                        "start": (datetime.now() - timedelta(days=30)).isoformat(),
                        "end": datetime.now().isoformat(),
                    },
                    "transactions": [
                        {
                            "date": (datetime.now() - timedelta(days=random.randint(1, 30))).isoformat(),
                            "description": random.choice([
                                "Grocery Store", "Gas Station", "Restaurant", "Online Shopping",
                                "Utility Bill", "Insurance Payment", "Subscription Service"
                            ]),
                            "amount": round(random.uniform(10, 200), 2),
                        }
                        for _ in range(random.randint(5, 15))
                    ],
                }
            elif doc_type == "receipt":
                analysis_data = {
                    "total": round(random.uniform(10, 150), 2),
                    "vendor": random.choice([
                        "Whole Foods", "Target", "Walmart", "Costco", "Home Depot",
                        "Starbucks", "McDonald's", "Shell Gas", "CVS Pharmacy"
                    ]),
                    "date": (datetime.now() - timedelta(days=random.randint(1, 30))).isoformat(),
                    "category": random.choice(["Foraging", "Building Material", "Obstacles"]),
                }
        
        uploaded_at = datetime.now() - timedelta(days=random.randint(0, 60))
        
        cursor.execute("""
            INSERT INTO documents (
                user_id, file_name, file_type, document_type, status,
                uploaded_at, analysis_data, size, pages, needs_review
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            user_id,
            file_name,
            "pdf" if file_name.endswith(".pdf") else "image",
            doc_type,
            status,
            uploaded_at,
            Json(analysis_data) if analysis_data else None,
            random.randint(50000, 5000000),
            random.randint(1, 10) if file_name.endswith(".pdf") else None,
            status == "failed" or (status == "completed" and random.random() < 0.1),
        ))
    
    print(f"✅ Created {count} mock documents")

def main():
    """Main seeder function"""
    print("🦫 Timber Money Database Seeder")
    print("=" * 50)
    
    conn = connect_db()
    cursor = conn.cursor()
    
    try:
        # Create test users
        users = create_test_users(cursor)
        
        # Create financial profiles for each user
        create_avalanche_profile(cursor, "test-user-avalanche")
        create_snowball_profile(cursor, "test-user-snowball")
        create_healthy_profile(cursor, "test-user-healthy")
        
        # Create mock documents
        create_mock_documents(cursor, "test-user-avalanche", 8, "avalanche")
        create_mock_documents(cursor, "test-user-snowball", 12, "snowball")
        create_mock_documents(cursor, "test-user-healthy", 25, "healthy")
        
        # Commit all changes
        conn.commit()
        
        print("\n" + "=" * 50)
        print("✅ Database seeding completed successfully!")
        print("\nTest Users Created:")
        print("1. avalanche@timbermoney.test - High credit card debt (Avalanche method)")
        print("2. snowball@timbermoney.test - Multiple small loans (Snowball method)")
        print("3. healthy@timbermoney.test - High savings, document volume")
        print("\n🦫 Ready to test Timber Money!")
        
    except Exception as e:
        conn.rollback()
        print(f"\n❌ Error seeding database: {e}")
        sys.exit(1)
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    main()
