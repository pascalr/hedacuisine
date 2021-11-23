json.article do
  json.id @article.id
  json.name @article.name
  json.content @article.content
  json.url article_path(@article)
end
