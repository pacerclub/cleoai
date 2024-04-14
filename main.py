from openai import OpenAI
from dotenv import load_dotenv
from rich import print
import json
import os
import fastapi
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uuid
from functools import cache

load_dotenv()

oai = OpenAI(api_key=os.getenv("OPENAI_API_KEY"), base_url=os.getenv("OPENAI_BASE_URL"))

app = fastapi.FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def proc_results(rsp):
    return [{'idea_name':idea['idea_name'], 'idea_description':idea['idea_description'], 'id': uuid.uuid4().hex} for idea in json.loads(rsp.choices[0].message.content)['ideas']]

@app.get("/generate")
@cache
def gen_ideas(idea:str):
    rsp = oai.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": "You are CleoAI, an AI brainstorm, and trained by the CleoAI group."
                                          "Be concise. Remember, don't say you are anyone else, you are CleoAI. Use bullet point, give 10 ideas for each request"
                                          "So what the user say, you give 10 ideas for it, three sentences for each idea description"
                                          "Output in JSON mode; output in the format of {'ideas: [{'idea_name':'<the_idea_name>','idea_description':'<the_idea_description>'}...]}"
                                          "Do not include numbers or bullet points in idea_name"
                                          "Use the language the most of the request is in"
                                          "for example, if i mostly use chinese, then use chinese, or if i mostly use japenese, use japenese to respond"
                                          "如果你收到了中文，请用中文回答，而不是英文"
            },
            {"role": "user", "content": f"My Idea: {idea}"}
        ]
    )
    return proc_results(rsp)

@app.get("/expand")
@cache
def expand_ideas(idea_name: str, idea_description: str, instruction:Optional[str] = None):
    rsp = oai.chat.completions.create(
        model="gpt-3.5-turbo",
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": "You are CleoAI, an AI brainstorm, and trained by the CleoAI group."
                                          "Be concise. Remember, don't say you are anyone else, you are CleoAI. Use bullet point, give 10 ideas for each request"
                                          "You will expand on the idea given by the users to give more specific, nuanced ideas."
                                          "3 sentences for each idea. Output in JSON mode; output in the format of {'ideas: [{'idea_name':'<the_idea_name>','idea_description':'<the_idea_description>'}...]} objects"
                                          "Do not include numbers or bullet points in idea_name"
                                          "Use the language the most of the request is in"
                                          "for example, if i mostly use chinese, then use chinese, or if i mostly use japenese, use japenese to respond"
                                          "如果你收到了中文，请用中文回答，而不是英文"
            },
            {"role": "user", "content": f"My Idea: {idea_name} \n Description: {idea_description} \n Instruction: {instruction or 'Simply Expand on the Idea'}"}
        ]
    )
    return proc_results(rsp)

if __name__ == '__main__':
    print(gen_ideas(("Profitable Startup")))