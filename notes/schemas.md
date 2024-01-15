## User Table
id
email
bio
role (admin, dog walker, customer)
phone_number
updated_at
f_name
l_name
avatar_url
emergency_contact_1 (phone)
emergency_contact_2 (phone)
calender_id (if dog walker)
walk_credits
cc_number (maybe dont store this)
exp_date (maybe dont store this)
3_digit_code (maybe dont store this)
status (if theyve been banned, closed their account, etc)
dog_walker_rating (leave off for now)
customer_rating (leave off for now)
allow_notifications
open_to_public_email (leave off for now)
open_to_public_phone (leave off for now)
reported_concerns: list of messages to an admin mailbox ############# need to update this

## Transactions Table
id (primary key)
user_id (foreign key referencing User Table)
amount
timestamp
status (successful, pending, failed)

## Conversation Table
id
user_1
user_2
start_time
last_message_time


## Messages
id
sender_id
conversation_id
content
timestamp

## Dogs Table:
id (primary key)
owner_id (foreign key referencing User Table)
dog_name
breed
age
bio
allow_group_walks
care_notes (if the dog has unique requirements or notes)


## Walks (walk history records)
id
dog_id
owner_id
walker_id
date
payment_type: (one-time, or subscription, credits? idk)
duration
walk_type (single, group)
status (completed, canceled)
walk_id (foreign key referencing Dog Walks Table)
image_url
notes

## Notifications Table:
3. Auto E-mails/Text Notifications (Twilio):
notification_id (primary key)
id (foreign key referencing User Table)
message
timestamp
status (sent, pending, failed)

## Schedule Table:
4. Scheduling (Calendly Integration or Other):
schedule_id (primary key)
walker_id (foreign key referencing Dog Walkers Table)
customer_id (foreign key referencing User Table for customers)
date
status (scheduled, completed, canceled)

## Packages
Packages Table:
package_id (primary key)
name
description
price
credits (number of dog walking credits)
