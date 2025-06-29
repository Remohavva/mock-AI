from flask import Flask, render_template, request, jsonify
import csv
import json
from difflib import SequenceMatcher
import re

app = Flask(__name__)

# Load Q&A data
def load_qa_data():
    try:
        # Try to load from CSV first
        qa_data = []
        with open('qa_data.csv', 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                qa_data.append({
                    'question': row['question'],
                    'answer': row['answer'],
                    'category': row.get('category', 'General')
                })
        return qa_data
    except FileNotFoundError:
        return [
            {
                'question': 'Explain normalization in DBMS',
                'answer': 'Normalization is a database design technique that organizes data to minimize redundancy and dependency. It involves dividing large tables into smaller ones and defining relationships between them. The main goals are to eliminate data redundancy, ensure data consistency, and improve data integrity. There are several normal forms (1NF, 2NF, 3NF, BCNF) with increasing levels of normalization.',
                'category': 'Database'
            },
            {
                'question': 'What is the difference between SQL and NoSQL?',
                'answer': 'SQL databases are relational databases that use structured query language and have a predefined schema. They are ACID compliant and best for complex queries and transactions. NoSQL databases are non-relational, have flexible schemas, and are designed for distributed data stores. They are better for handling large amounts of unstructured data and horizontal scaling.',
                'category': 'Database'
            },
            {
                'question': 'Explain REST API principles',
                'answer': 'REST (Representational State Transfer) is an architectural style for designing networked applications. Key principles include: 1) Stateless - each request contains all information needed, 2) Client-Server separation, 3) Cacheable responses, 4) Uniform interface with standard HTTP methods (GET, POST, PUT, DELETE), 5) Layered system architecture, 6) Code on demand (optional).',
                'category': 'Web Development'
            },
            {
                'question': 'What is the difference between GET and POST?',
                'answer': 'GET requests are used to retrieve data and are idempotent (safe to repeat). Data is sent in URL parameters and has length limitations. POST requests are used to submit data to be processed, are not idempotent, send data in request body, and have no length limitations. GET requests can be cached and bookmarked, while POST requests cannot.',
                'category': 'Web Development'
            },
            {
                'question': 'Explain object-oriented programming concepts',
                'answer': 'OOP is a programming paradigm based on objects. Key concepts include: 1) Encapsulation - bundling data and methods that operate on that data, 2) Inheritance - creating new classes from existing ones, 3) Polymorphism - ability to present the same interface for different underlying forms, 4) Abstraction - hiding complex implementation details.',
                'category': 'Programming'
            },
            {
                'question': 'What is the difference between list and tuple in Python?',
                'answer': 'Lists are mutable (can be changed after creation) and use square brackets []. Tuples are immutable (cannot be changed after creation) and use parentheses (). Lists are typically used for collections of similar items that may change, while tuples are used for collections of related items that shouldn\'t change. Tuples are slightly more memory efficient.',
                'category': 'Python'
            },
            {
                'question': 'Explain time complexity and Big O notation',
                'answer': 'Time complexity measures how the runtime of an algorithm grows with input size. Big O notation describes the worst-case scenario. Common complexities: O(1) - constant time, O(log n) - logarithmic, O(n) - linear, O(n²) - quadratic, O(2ⁿ) - exponential. Space complexity measures memory usage growth.',
                'category': 'Algorithms'
            },
            {
                'question': 'What is a binary search tree?',
                'answer': 'A Binary Search Tree (BST) is a hierarchical data structure where each node has at most two children. For any node, all values in the left subtree are less than the node\'s value, and all values in the right subtree are greater. This property enables efficient searching, insertion, and deletion operations with O(log n) average time complexity.',
                'category': 'Data Structures'
            },
            {
                'question': 'Explain the difference between stack and queue',
                'answer': 'A stack follows LIFO (Last In, First Out) principle - the last element added is the first one removed. Operations are push (add) and pop (remove). A queue follows FIFO (First In, First Out) principle - the first element added is the first one removed. Operations are enqueue (add) and dequeue (remove).',
                'category': 'Data Structures'
            },
            {
                'question': 'What is dependency injection?',
                'answer': 'Dependency Injection is a design pattern where dependencies (objects that a class needs) are provided to the class rather than the class creating them itself. This promotes loose coupling, makes code more testable, and follows the dependency inversion principle. It can be implemented through constructor injection, setter injection, or interface injection.',
                'category': 'Software Design'
            }
        ]

def find_best_match(user_question, qa_data):
    """Find the best matching question using similarity matching"""
    best_match = None
    best_score = 0
    
    user_question_clean = re.sub(r'[^\w\s]', '', user_question.lower())
    
    for qa in qa_data:
        stored_question_clean = re.sub(r'[^\w\s]', '', qa['question'].lower())
        
        similarity = SequenceMatcher(None, user_question_clean, stored_question_clean).ratio()
        
        user_words = set(user_question_clean.split())
        stored_words = set(stored_question_clean.split())
        word_overlap = len(user_words.intersection(stored_words)) / max(len(user_words), len(stored_words)) if user_words else 0
        
        
        combined_score = (similarity + word_overlap) / 2
        
        if combined_score > best_score:
            best_score = combined_score
            best_match = qa
    
    return best_match if best_score > 0.3 else None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_question = data.get('question', '').strip()
        
        if not user_question:
            return jsonify({
                'success': False,
                'message': 'Please provide a question.'
            })
        
        
        qa_data = load_qa_data()
        
        
        best_match = find_best_match(user_question, qa_data)
        
        if best_match:
            return jsonify({
                'success': True,
                'answer': best_match['answer'],
                'category': best_match['category'],
                'confidence': 'High' if 'normalization' in user_question.lower() else 'Medium'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'I couldn\'t find a good match for your question. Try rephrasing or ask about topics like database normalization, SQL vs NoSQL, REST APIs, OOP concepts, Python data structures, algorithms, or software design patterns.'
            })
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'An error occurred: {str(e)}'
        })

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all available categories"""
    qa_data = load_qa_data()
    categories = list(set(qa['category'] for qa in qa_data))
    return jsonify({'categories': categories})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 