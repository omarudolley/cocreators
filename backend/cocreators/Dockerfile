FROM python:3.7.3-slim
WORKDIR /home/app
RUN mkdir -p /home/app
COPY . /home/app
RUN pip install -r requirements.txt
CMD ["gunicorn","app:app", "-b0.0.0.0:8000","-w1"] 
