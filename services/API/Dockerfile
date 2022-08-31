# FROM public.ecr.aws/lambda/nodejs:14
# ARG FUNCTION_DIR="/dist"

# We are making the docker image after build
# So only need production packages

ARG FUNCTION_DIR="./"
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_SESSION_TOKEN
FROM public.ecr.aws/docker/library/node:17-buster as build-image
# FROM node:17-buster as build-image
ARG FUNCTION_DIR
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_SESSION_TOKEN
ENV ARG AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
ENV AWS_SESSION_TOKEN=${AWS_SESSION_TOKEN}
COPY package*.json ${FUNCTION_DIR}
COPY pnpm-lock.yaml ${FUNCTION_DIR}
# COPY node_modules ./node_modules
COPY dist ./dist
# COPY .env ./.env
# COPY assets ./assets
# COPY node_modules ./node_modules
# RUN npm install npm@latest -g
RUN	npm install pnpm awsudo -g
# RUN pnpm add aws-lambda-ric
ENV key=value

RUN apt-get update && \
    apt-get install -y \
    g++ \
    make \
    cmake \
    unzip \
    libcurl4-openssl-dev

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install

RUN pnpm co:login:cloud
RUN pnpm add aws-lambda-ric
# RUN pnpm remove api
# RUN pnpm add pnpm
	
WORKDIR ${FUNCTION_DIR}

FROM public.ecr.aws/docker/library/node:17-buster-slim
# FROM node:17-buster-slim
ARG FUNCTION_DIR

WORKDIR ${FUNCTION_DIR}
COPY --from=build-image ${FUNCTION_DIR} ${FUNCTION_DIR}

ENTRYPOINT ["/usr/local/bin/pnpm", "exec", "aws-lambda-ric"]
CMD ["dist/main.handler"]