import re

# 파일 읽기
with open('src/mockdata/report/individualmockdetail.js', 'r', encoding='utf-8') as f:
    content = f.read()

# "문장 끝 흐릿함" 블록 제거 (복잡한 패턴)
# 각 블록은 { label: '문장 끝 흐릿함', ... }, 형태
pattern = r',\s*\{\s*label:\s*[\'"]문장 끝 흐릿함[\'"]\s*,\s*description:\s*[\'"]문장 끝을 명확하게 마무리하지 못한 정도를 분석합니다\.[\'"],?\s*detail:\s*[\'"][^\'"]*[\'"]\s*,?\s*\}'

new_content = re.sub(pattern, '', content, flags=re.MULTILINE | re.DOTALL)

# 파일 쓰기
with open('src/mockdata/report/individualmockdetail.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("✅ individualmockdetail.js 수정 완료")
print("- '문장 끝 흐릿함' 항목 제거")

