module ViewHelpers
  def params
    request.query.dup
  end
end