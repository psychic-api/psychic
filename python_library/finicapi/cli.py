import os
import sys
import json
from .finic import Finic
import subprocess


def zip_files_cli(zip_file):
    try:
        # First zip command (for untracked files)
        command_1 = (
            f"git ls-files -z --others --exclude-standard | xargs -0 zip -r {zip_file}"
        )
        subprocess.run(
            command_1, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
        )

        # Second zip command (for tracked files)
        command_2 = f"git ls-files -z | xargs -0 zip -ur {zip_file}"
        subprocess.run(
            command_2, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
        )

        print(f"Zipped files into {zip_file}")

    except subprocess.CalledProcessError as e:
        print(f"Error occurred during zipping: {e}")


def create_finic_app(argv=sys.argv):
    if len(argv) < 2:
        print("Please specify the project directory:\n create-finic-app <project-name>")
        return
    directory_name = argv[1]

    os.system(
        f"git clone https://github.com/finic-ai/create-finic-app {directory_name}"
    )
    print(
        f"Finic app created successfully. cd into /{directory_name} and run `poetry install` to install dependencies"
    )


def deploy(argv=sys.argv):
    print("Enter your API key:")
    api_key = input()

    # Check if finic_config.json exists
    if not os.path.exists("finic_config.json"):
        print(
            "finic_config.json not found. Please create a finic_config.json file in the root directory of your project"
        )
        return

    server_url = None
    with open("finic_config.json", "r") as f:
        config = json.load(f)
        if "finic_url" in config:
            server_url = config["finic_url"]
        if "agent_name" not in config:
            print("Please specify the agent_name in the finic_config.json file")
            return
        agent_name = config["agent_name"]
        if "agent_id" not in config:
            print("Please specify the agent_id in the finic_config.json file")
            return
        agent_id = config["agent_id"]
        if "num_retries" not in config:
            print("Please specify the num_retries in the finic_config.json file")
            return
        num_retries = config["num_retries"]

    finic = Finic(api_key=api_key, url=server_url)

    temp_dir = os.path.join(os.getcwd(), "temp")
    zip_file = os.path.join(temp_dir, "project.zip")

    # Create the /tmp directory if it doesn't exist
    os.makedirs(temp_dir, exist_ok=True)

    # Zip the project into /tmp/project.zip, ignoring all .gitignore patterns

    zip_files_cli(zip_file)

    result = finic.deploy_agent(agent_id, agent_name, num_retries, zip_file)

    print(result)
