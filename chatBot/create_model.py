from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "microsoft/phi-2"  # Replace with actual model name
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)
