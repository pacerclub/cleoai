# CleoAI - AI Brainstorming Assistant

Welcome to CleoAI, your personal AI brainstorming assistant designed to help you generate and expand ideas effortlessly. Leveraging the power of artificial intelligence, CleoAI provides an interactive platform to transform your initial thoughts into comprehensive concepts.

## Features
- **Idea Generation**: Input your initial idea and let CleoAI generate related concepts.
- **Idea Expansion**: Select any generated idea to explore further and develop it into a more detailed concept.
- **Interactive Pathway**: Navigate through your ideas via an intuitive breadcrumb trail.

## Quick Start

Visit [CleoAI.cn](https://cleoai.cn) to start generating ideas online.

## Installation

1. Ensure you have Python 3.8+ installed on your system.
2. Clone this repository or download the source code.
3. Install the required dependencies by running:

   ```sh
   pip install -r requirements.txt
   ```

4. To start the application locally, run:

   ```sh
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
   ```

## Usage

To generate ideas using CleoAI:

1. Enter your initial thought into the input bar on the homepage.
2. Click the "Generate Ideas" button to see a list of related concepts.
3. Expand on any idea by clicking the "Expand" button associated with it.

## Contributing

We welcome contributions to CleoAI. If you have suggestions or improvements, please fork the repository and submit a pull request.

## License

CleoAI is open-source software licensed under the [MIT License](LICENSE).

## Developers

This project was developed by [Zigao Wang](https://github.com/ZigaoWang) and [Jett Chen](https://github.com/JettChenT).

## Support

For support, email us at *a@zigao.wang* or open an issue in the GitHub repository.

## Acknowledgements

Special thanks to the contributors who have helped shape CleoAI into what it is today.

---
&copy; 2024 CleoAI. All rights reserved.
