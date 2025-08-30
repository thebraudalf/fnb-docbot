# Step 1: Use a base Python image
FROM python:3.9-slim

# Step 2: Set environment variables
# This prevents python from writing .pyc files to disc
ENV PYTHONUNBUFFERED 1

# Step 3: Set the working directory inside the container
WORKDIR /app

# Step 4: Install system dependencies (for PDF, DOCX, FAISS, etc.)
RUN apt-get update \
    && apt-get install -y \
    build-essential \
    libmagic-dev \
    libxml2-dev \
    libxslt-dev \
    python3-dev \
    gcc \
    g++ \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Step 5: Install dependencies
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Step 6: Copy the application code into the container
COPY . /app/

# Step 7: Expose the port the app will run on
EXPOSE 10000

# Step 8: Define the entry point to start the FastAPI app with Uvicorn
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port $PORT"]