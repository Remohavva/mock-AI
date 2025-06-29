# 🚀 MockAI

A smart chatbot designed to help students prepare for technical interviews by providing detailed answers to common interview questions. Built with Flask, Python, and modern web technologies.

## ✨ Features

- **Smart Question Matching**: Uses similarity algorithms to find the best matching questions
- **Rich Q&A Database**: Pre-loaded with common technical interview questions
- **Modern UI**: Beautiful, responsive chat interface with smooth animations
- **Category Organization**: Questions organized by topics (Database, Web Development, Programming, etc.)
- **Real-time Chat**: Live typing indicators and instant responses
- **Mobile Responsive**: Works perfectly on all devices
- **Sample Questions**: Quick access to common interview topics

## 🛠 Tech Stack

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Bootstrap 5 + Custom CSS
- **Data Storage**: CSV file (easily extensible to database)
- **Icons**: Font Awesome

## 📁 Project Structure

```
interview-bot/
├── app.py              # Main Flask application
├── qa_data.csv         # Q&A database
├── requirements.txt    # Python dependencies
├── README.md          # Project documentation
├── templates/
│   └── index.html     # Main chat interface
└── static/
    ├── style.css      # Custom styling
    └── script.js      # Frontend functionality
```

## 🚀 Quick Start

### Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

### Installation

1. **Clone or download the project**
   ```bash
   # If you have git installed
   git clone <repository-url>
   cd interview-bot
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python app.py
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000`

## 💡 How to Use

1. **Ask Questions**: Type any technical interview question in the chat input
2. **Sample Questions**: Click on the sample questions in the sidebar for quick access
3. **Topic Tags**: Click on topic badges to explore specific categories
4. **Clear Chat**: Use the clear button to start a new conversation

### Example Questions You Can Ask

- "Explain normalization in DBMS"
- "What is the difference between SQL and NoSQL?"
- "Explain REST API principles"
- "What is object-oriented programming?"
- "Explain time complexity and Big O notation"
- "What is the difference between stack and queue?"

## 🔧 Customization

### Adding New Questions

1. **Edit the CSV file**: Add new rows to `qa_data.csv`
   ```csv
   question,answer,category
   "Your question here","Your detailed answer here","Category Name"
   ```

2. **Or modify the code**: Edit the default data in `app.py`

### Styling Changes

- Modify `static/style.css` for visual changes
- Update `templates/index.html` for layout changes
- Edit `static/script.js` for functionality changes

### Adding New Categories

1. Add new category names to your Q&A data
2. The system will automatically detect and display new categories
3. Update the topic tags in `templates/index.html` if needed

## 🎯 Key Features Explained

### Smart Matching Algorithm

The chatbot uses a combination of:
- **Sequence Matching**: Compares text similarity
- **Word Overlap**: Checks for common keywords
- **Normalization**: Removes punctuation and case differences

### Responsive Design

- **Desktop**: Full sidebar + chat layout
- **Mobile**: Collapsible sidebar with touch-friendly interface
- **Tablet**: Optimized layout for medium screens

### Performance Optimizations

- **Lazy Loading**: Messages load smoothly with animations
- **Efficient Search**: Fast similarity matching algorithms
- **Minimal Dependencies**: Lightweight and fast

## 🚀 Deployment

### Local Development
```bash
python app.py
```

### Production Deployment
1. Set `debug=False` in `app.py`
2. Use a production WSGI server like Gunicorn
3. Configure environment variables for security

### Docker Deployment (Optional)
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎓 Learning Objectives

This project demonstrates:
- **Flask Web Development**: Building REST APIs
- **Frontend Development**: Modern JavaScript and CSS
- **NLP Basics**: Text similarity and matching
- **Database Design**: Simple data storage and retrieval
- **UI/UX Design**: Creating intuitive user interfaces
- **Full-Stack Integration**: Connecting frontend and backend

## 🔮 Future Enhancements

- [ ] User authentication and personalization
- [ ] Advanced NLP with machine learning
- [ ] Question difficulty levels
- [ ] Progress tracking and analytics
- [ ] Integration with external APIs
- [ ] Voice input/output capabilities
- [ ] Multi-language support

## 📞 Support

If you have any questions or need help:
1. Check the documentation above
2. Review the code comments
3. Open an issue on GitHub

---

**Happy Interview Preparation! 🎯** 