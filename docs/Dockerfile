FROM python:3.9-slim

RUN pip install mkdocs-material

WORKDIR /docs

# Copy mkdocs.yml into the container
COPY mkdocs.yml /docs/

EXPOSE 8000

CMD ["mkdocs", "serve", "-a", "0.0.0.0:8000"] 