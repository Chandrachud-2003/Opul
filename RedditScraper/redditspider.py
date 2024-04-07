# redditspider.py
# Chandrachud Gowda
# Created on Sunday, April 7, 2024

# Uses PRAW to fetch reent 1000 posts from a subreddit

# Importing the required libraries
import numpy
import pandas as pd
import praw


import os
from dotenv import load_dotenv
import sys
from datetime import datetime

# Find the project directory (Opul) based on the current directory
current_dir = os.path.dirname(os.path.abspath(__file__))
opul_dir = None
opul_sys_path = None
while current_dir != os.path.sep:
    if os.path.basename(current_dir) == 'Opul':
        Opul_dir = current_dir
        break
    current_dir = os.path.dirname(current_dir)

if Opul_dir:
    # Append the project directory to sys.path
    sys.path.append(Opul_dir)
    # Geting this sys path
    RandD_sys_path = sys.path[-1]
    # print("Project directory 'RandD' found at: ", RandD_dir)

    # Printing the sys path
    # print("sys.path: ", sys.path)
else:
    print("Project directory 'Opul' not found in the directory structure.")

from constants import *

load_dotenv()
 
reddit = praw.Reddit(client_id=os.getenv("REDDIT_SPIDER_CLIENT_ID"),       
                               client_secret=os.getenv('REDDIT_SPIDER_CLIENT_SECRET'),    
                               user_agent=os.getenv("REDDIT_SPIDER_USER_AGENT"))        
 
 
# Defining the list of subreddits
subreddits_master_list = [CHURNING_REFERRALS_SUBREDDIT]

# Looping through all the subreddits
for subreddit in subreddits_master_list:
    hot_posts = reddit.subreddit(subreddit).hot(limit=10)
    for post in hot_posts:
        print('Post ID: ', post.id)
        print('Post Title: ', post.title)
        print('Post Score: ', post.score)
        print('Post URL: ', post.url)
        print('Post Number of Comments: ', post.num_comments)
        print('Post selftext: ', post.selftext)
        print('Post created datetime: ', post.created)
        print('\n')

        # Getting comments for the post
        print("Comments:")

        post_submission = reddit.submission(id = post.id)
        post_submission.comments.replace_more(limit=0)

        for top_level_comment in post_submission.comments.list():
            print('\t', top_level_comment.body)
        
        print('\n-------------------------------------------------\n')
