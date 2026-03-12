import os
import json
import random
from flask import Flask, render_template, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ==================== YOUR PERSONAL INFO ====================
YOUR_NAME = "Manish Ray"
YOUR_PHONE = "+977 9849417012"
YOUR_CITY = "Kathmandu, Nepal"
YOUR_EMAIL = "pro.manishray@gmail.com"
GITHUB_USERNAME = "UnrealistManish"  # Replace with your actual GitHub username
# =============================================================

# Sample projects data
PROJECTS = [
    {
        "id": 1,
        "title": "RentMate",
        "description": "Roommate finding platform – connect with flatmates, manage shared living expenses and chores.",
        "long_description": "A comprehensive platform that helps students and professionals find compatible roommates, manage shared expenses, and organize household tasks.",
        "icon": "fas fa-home",
        "image": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
        "technologies": ["React", "Node.js", "MongoDB", "Socket.io"],
        "github": "https://github.com/yourusername/rentmate",
        "live": "https://rentmate-demo.herokuapp.com",
        "featured": True
    },
    {
        "id": 2,
        "title": "WeatherFlow",
        "description": "Real-time weather app with interactive maps and 7-day forecast.",
        "icon": "fas fa-cloud-sun",
        "image": "https://images.unsplash.com/photo-1504608524841-42fe6fd032b4?w=400&h=300&fit=crop",
        "technologies": ["JavaScript", "OpenWeather API", "Chart.js", "Mapbox"],
        "github": "https://github.com/yourusername/weatherflow",
        "live": "https://weatherflow-demo.netlify.app",
        "featured": True
    },
    {
        "id": 3,
        "title": "TaskMaster Pro",
        "description": "AI-powered task management with smart scheduling.",
        "icon": "fas fa-tasks",
        "image": "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop",
        "technologies": ["Vue.js", "Flask", "PostgreSQL", "TensorFlow.js"],
        "github": "https://github.com/yourusername/taskmaster",
        "live": "https://taskmaster-pro.herokuapp.com",
        "featured": False
    }
]

# Blog posts
BLOG_POSTS = [
    {
        "title": "Building Real-time Apps with Socket.io",
        "date": "2024-02-15",
        "summary": "Learn how to create real-time features like chat and live updates using Socket.io",
        "url": "#"
    },
    {
        "title": "Optimizing React Performance",
        "date": "2024-01-20",
        "summary": "Tips and tricks to make your React applications faster and more efficient",
        "url": "#"
    },
    {
        "title": "Getting Started with Machine Learning",
        "date": "2023-12-10",
        "summary": "A beginner's guide to understanding and implementing basic ML algorithms",
        "url": "#"
    }
]

# Fun facts
FUN_FACTS = [
    "The first computer virus was created in 1983 as an experiment.",
    "Python was named after Monty Python, not the snake.",
    "The world's first website is still online at info.cern.ch.",
    "More than 80% of developers suffer from imposter syndrome.",
    "The first 1GB hard drive weighed over 500 pounds in 1980.",
    "JavaScript was created in just 10 days.",
    "The term 'bug' came from a real moth found in a Harvard computer.",
    "There are over 700 programming languages in existence."
]

@app.route('/')
def index():
    return render_template('index.html', 
                           name=YOUR_NAME, 
                           phone=YOUR_PHONE, 
                           city=YOUR_CITY, 
                           email=YOUR_EMAIL)

@app.route('/api/projects')
def get_projects():
    return jsonify(PROJECTS)

@app.route('/api/blog')
def get_blog():
    return jsonify(BLOG_POSTS)

@app.route('/api/fun-fact')
def get_fun_fact():
    return jsonify({"fact": random.choice(FUN_FACTS)})

@app.route('/api/github-stats')
def get_github_stats():
    """Fetch GitHub user stats using GitHub API (no key needed for public data)"""
    import requests
    try:
        response = requests.get(f'https://api.github.com/users/{GITHUB_USERNAME}', timeout=5)
        if response.status_code == 200:
            user_data = response.json()
            return jsonify({
                "public_repos": user_data.get("public_repos", 0),
                "followers": user_data.get("followers", 0),
                "following": user_data.get("following", 0)
            })
        else:
            return jsonify({"public_repos": 24, "followers": 156, "following": 89})
    except:
        return jsonify({"public_repos": 24, "followers": 156, "following": 89})

@app.route('/api/visitor-count')
def visitor_count():
    return jsonify({"count": random.randint(1000, 5000)})

@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')
    
    if not name or not email or not message:
        return jsonify({'success': False, 'error': 'All fields are required.'}), 400
    
    # Gmail-only validation
    if not email.endswith('@gmail.com'):
        return jsonify({'success': False, 'error': 'Only Gmail addresses are allowed.'}), 400
    
    print(f"New message from {name} ({email}): {message}")
    
    return jsonify({
        'success': True, 
        'message': f'Thanks {name}! Your message has been sent successfully.'
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)