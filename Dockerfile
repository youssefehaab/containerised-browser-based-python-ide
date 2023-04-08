FROM centos:latest
RUN yum -y install httpd
WORKDIR /var/www/html
COPY html /var/www/html
CMD ["/usr/sbin/httpd", "-D", "FOREGROUND"]
EXPOSE 80