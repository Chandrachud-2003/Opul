import scrapy

class RedditSpider(scrapy.Spider):
    name = 'redditspider'
    allowed_domains = ['reddit.com']
    start_urls = ['https://www.reddit.com/r/churningreferrals/']

    def parse(self, response):
        # Extracting the content using css selectors
        for post in response.css('div.Post'):
            title = post.css('h3::text').get()
            url = post.css('a::attr(href)').get()
            yield {
                'title': title,
                'url': response.urljoin(url),
            }
            
            # Following the link to the post
            if url:
                yield response.follow(url, self.parse_post)
        
        # Following the pagination link
        next_page = response.css('a.next-button::attr(href)').get()
        if next_page is not None:
            yield response.follow(next_page, self.parse)

    def parse_post(self, response):
        # Extracting post details
        description = response.css('div.Post div._2SdHzo12ISmrC8H86TgSCp ::text').getall()
        comments = response.css('div.Comment div._3sf33-9rVAO_v4y0pIW_CH ::text').getall()
        yield {
            'url': response.url,
            'description': ' '.join(description).strip(),
            'comments': ' '.join(comments).strip(),
        }