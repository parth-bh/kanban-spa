import smtplib    # python library
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from flask import jsonify
from jinja2 import Template
from flask import Flask, render_template
from weasyprint import HTML
import uuid
from flask import Flask, render_template
from .workers import celery
from datetime import datetime
from celery.schedules import crontab

import os
class sendEmail:
	SMTP_SERVER_HOST = "localhost"
	SMTP_SERVER_PORT = 1025
	SENDER_ADDRESS = "email@parth.com"    
	SENDER_PASSWORD = ""				

	def send_email(self, to_address, subject, message, content="text", attachment_file=None, file_name=None):  
		msg= MIMEMultipart()
		msg['From'] = self.SENDER_ADDRESS
		msg["To"] = to_address
		msg["Subject"] = subject

		if content == "html":
			msg.attach(MIMEText(message, "html")) # this become the body of the email.
		else:
			msg.attach(MIMEText(message, "plain")) # this become the body of the email.

		if attachment_file:
			with open(attachment_file, "rb") as attachment:
				part = MIMEBase("application", "octet-stream")
				part.set_payload(attachment.read()) # added as a payload.
			encoders.encode_base64(part)
			part.add_header("Content-Disposition", f"attachment; filename= {file_name}")
			msg.attach(part)

		try:
			s= smtplib.SMTP(host=self.SMTP_SERVER_HOST, port=self.SMTP_SERVER_PORT)
			s.login(self.SENDER_ADDRESS, self.SENDER_PASSWORD)
			s.send_message(msg)
			s.quit() 
		except:
			return False
		return True

	def format_message(self, template_file, data={}):
		path = os.getcwd() + "/templates/"+template_file	
		return render_template(template_file, data=data)

	def create_pdf_report(self, data, template_file):
		path = os.getcwd() + "/templates/"+template_file
		message= self.format_message(template_file, data=data)
		html = HTML(string=message)
		file_name = "progress_report.pdf"
		target_path = os.getcwd() + "/attachment/"+file_name
		html.write_pdf(target=target_path)
		return target_path, file_name


	def send_daily_reminder(self, data):
		message = self.format_message("daily_reminder.html", data)
		status = self.send_email(
			data["email"], 
			subject="Daily Reminder", 
			message=message, content="html", 
			)
		return status

	def send_user_data(self, user, file_path, file_name):
		message = self.format_message("user_data_template.html", user)
		status = self.send_email(
			user["email"], 
			subject="Dataset", 
			message=message, 
			content="html",
			attachment_file=file_path,
			file_name=file_name
			)
		return status
