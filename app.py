from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

def check_password_strength(password):
    score = 0
    feedback = []
    
    # Check length
    if len(password) >= 8:
        score += 1
        feedback.append("Good length")
    else:
        feedback.append("Password should be at least 8 characters")
    
    # Check for numbers
    if any(char.isdigit() for char in password):
        score += 1
        feedback.append("Contains numbers")
    else:
        feedback.append("Should contain numbers")
    
    # Check for uppercase letters
    if any(char.isupper() for char in password):
        score += 1
        feedback.append("Contains uppercase letters")
    else:
        feedback.append("Should contain uppercase letters")
    
    # Check for lowercase letters
    if any(char.islower() for char in password):
        score += 1
        feedback.append("Contains lowercase letters")
    else:
        feedback.append("Should contain lowercase letters")
    
    # Check for special characters
    special_chars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
    if any(char in special_chars for char in password):
        score += 1
        feedback.append("Contains special characters")
    else:
        feedback.append("Should contain special characters")
    
    # Calculate strength percentage
    strength_percentage = (score / 5) * 100
    
    # Determine strength level
    if strength_percentage >= 80:
        strength = "Strong"
    elif strength_percentage >= 60:
        strength = "Moderate"
    else:
        strength = "Weak"
    
    return {
        "strength": strength,
        "percentage": strength_percentage,
        "feedback": feedback
    }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/check_password', methods=['POST'])
def check_password():
    password = request.json.get('password', '')
    result = check_password_strength(password)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
