FROM nikolaik/python-nodejs:latest

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /noteadder

COPY Pipfile Pipfile.lock /noteadder/
RUN pip install pipenv && pipenv install --system


COPY . /noteadder/