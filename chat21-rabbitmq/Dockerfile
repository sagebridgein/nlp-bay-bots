FROM rabbitmq:3.8.5-management-alpine

RUN rabbitmq-plugins enable --offline rabbitmq_mqtt rabbitmq_web_mqtt rabbitmq_auth_backend_oauth2 rabbitmq_federation_management rabbitmq_stomp

COPY ./advanced.config /etc/rabbitmq/advanced.config
COPY ./rabbitmq.conf /etc/rabbitmq/rabbitmq.conf
