# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory inside the container to /app
WORKDIR /app

# Copy the requirements.txt from the root directory into the container
COPY ../requirements.txt /app/requirements.txt

# Install the required Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app code into the container
COPY . /app

# Expose port 5001
EXPOSE 5001

# Set environment variables for Flask
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Run the Flask app
CMD ["flask", "run", "--port=5001"]
