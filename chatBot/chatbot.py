from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
import torch

# Tải mô hình Phi-2
model_name = "microsoft/phi-2"
quant_config = BitsAndBytesConfig(load_in_4bit=True)

tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name, quantization_config=quant_config, device_map="auto")

# Hàm để chat với AI
def chat_with_ai(prompt):
    inputs = tokenizer(prompt, return_tensors="pt").to("cuda")
    output = model.generate(**inputs, max_length=200, temperature=0.7, top_p=0.9)
    return tokenizer.decode(output[0], skip_special_tokens=True)

# Vòng lặp chat
print("Chatbot Phi-2 (Nhập 'exit' để thoát)")
while True:
    user_input = input("Bạn: ")
    if user_input.lower() == "exit":
        break
    response = chat_with_ai(user_input)
    print("AI:", response)
