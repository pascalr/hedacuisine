json.article do
  json.id @article.id
  json.name @article.name
  json.json @article.json
  json.url article_path(@article)
end
#json.content @article.content
