FROM node:lts

RUN apt-get update && \
    apt-get clean autoclean && \
    apt-get autoremove --yes && \
    rm -rf /var/lib/{apt,dpkg,cache,log}

ENV PNPM_HOME=/workspaces/pnpm
RUN corepack enable pnpm
