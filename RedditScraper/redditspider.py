# redditspider.py
# Chandrachud Gowda
# Created on Sunday, April 7, 2024

# Uses PRAW to fetch reent 1000 posts from a subreddit
import os
import sys
import praw
from dotenv import load_dotenv
from constants import *

def find_project_directory():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    while current_dir != os.path.sep:
        if os.path.basename(current_dir) == 'Opul':
            return current_dir
        current_dir = os.path.dirname(current_dir)
    print("Project directory 'Opul' not found in the directory structure.")
    return None

def print_post_details(post):
    print('Post ID: ', post.id)
    print('Post Title: ', post.title)
    print('Post Score: ', post.score)
    print('Post URL: ', post.url)
    print('Post Number of Comments: ', post.num_comments)
    print('Post selftext: ', post.selftext)
    print('Post created datetime: ', post.created)
    print('\n')

def print_comments(reddit, post):
    print("Comments:")
    post_submission = reddit.submission(id = post.id)
    post_submission.comments.replace_more(limit=0)
    for top_level_comment in post_submission.comments.list():
        print('\t', top_level_comment.body)
    print('\n-------------------------------------------------\n')

def fetch_and_print_posts(reddit, subreddit_list):
    for subreddit in subreddit_list:
        try:
            hot_posts = reddit.subreddit(subreddit).hot(limit=10)
        except Exception as e:
            print(f"Error fetching posts for subreddit {subreddit}: {e}")
            continue

        for post in hot_posts:
            print_post_details(post)
            print_comments(reddit, post)

def main():
    load_dotenv()
    reddit = praw.Reddit(client_id=os.getenv("REDDIT_SPIDER_CLIENT_ID"),       
                               client_secret=os.getenv('REDDIT_SPIDER_CLIENT_SECRET'),    
                               user_agent=os.getenv("REDDIT_SPIDER_USER_AGENT"))        

    opul_dir = find_project_directory()
    if opul_dir:
        sys.path.append(opul_dir)

    subreddit_list = [CHURNING_REFERRALS_SUBREDDIT]
    fetch_and_print_posts(reddit, subreddit_list)

if __name__ == "__main__":
    main()