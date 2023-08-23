### Usage
- Start:          `docker compose up`
- Start With helpers:   `docker compose -f docker-compose.yml -f docker-compose.dev.yml up`
- Stop:           `docker compose down`
- Destroy:        `docker compose -f docker-compose.yml -f ./docker-compose.dev.yml down -v --remove-orphans`
