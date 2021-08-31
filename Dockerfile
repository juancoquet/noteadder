FROM python:3.8

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /noteadder

COPY Pipfile Pipfile.lock /noteadder/
RUN pip install pipenv && pipenv install --system

COPY . /noteadder/