FROM python:3-slim

WORKDIR /usr/src/app

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000
EXPOSE 5001

CMD ["bash", "-c", "python seed.py && python cafe.py & python employee.py & wait"]