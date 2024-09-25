import sys
import os
import subprocess
from PyQt6.QtCore import QUrl
from PyQt6.QtWidgets import QApplication, QWidget, QVBoxLayout, QLabel, QMessageBox
from PyQt6.QtWebEngineWidgets import QWebEngineView

class LoadingScreen(QWidget):
    def __init__(self):
        super().__init__()
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout()
        
        self.label = QLabel("Loading, please wait...")
        layout.addWidget(self.label)
        
        self.setLayout(layout)
        self.setWindowTitle("Loading")

        self.setFixedSize(200, 100)

class ModelViewer(QWidget):
    def __init__(self):
        super().__init__()
        self.loading_screen = LoadingScreen()
        self.loading_screen.show()

        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout()
        self.browser = QWebEngineView()

        self.browser.loadStarted.connect(self.on_load_started)
        self.browser.loadFinished.connect(self.on_load_finished)

        server_path = self.find_server_file()
        if server_path:
            subprocess.Popen(["python", server_path], shell=True)

            current_dir = os.path.dirname(os.path.abspath(__file__))
            index_html_path = os.path.join(current_dir, "templates", "index.html")
            self.browser.setUrl(QUrl.fromLocalFile(index_html_path))

        layout.addWidget(self.browser)
        self.setLayout(layout)

        self.resize(1200, 800)

    def on_load_started(self):
        self.loading_screen.show()

    def on_load_finished(self, success):
        self.loading_screen.close()

        if not success:
            QMessageBox.critical(self, "Load Error", "Failed to load the page.")

    def find_server_file(self):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        for root, dirs, files in os.walk(current_dir):
            if "server.py" in files:
                return os.path.join(root, "server.py")

def main():
    app = QApplication(sys.argv)

    def handle_exception(exctype, value, tb):
        if issubclass(exctype, KeyboardInterrupt):
            sys.exit()
        else:
            QMessageBox.critical(None, 'Critical Error', 'An unexpected error occurred!')
            sys.exit(1)

    sys.excepthook = handle_exception

    viewer = ModelViewer()
    viewer.setWindowTitle("Model Viewer Test")
    viewer.show()

    sys.exit(app.exec_())

if __name__ == '__main__':
    main()
