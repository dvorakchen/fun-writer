mkdir ~/data/fun-writer -p

podman build . -t fun-writer-web

podman pod create --name fun-writer-pod -p 3000:3000
# podman run --pod fun-writer-pod --name postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=123123 -e POSTGRES_DB=fun-writer -d hub.aiursoft.cn/postgres:latest
podman run --pod fun-writer-pod --name postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=123123 -e POSTGRES_DB=fun-writer -v ~/data/fun-writer:/var/lib/postgresql/data -d hub.aiursoft.cn/postgres:latest   
podman run --pod fun-writer-pod -d fun-writer-web