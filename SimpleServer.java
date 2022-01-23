import java.io.InputStream;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;

public class Main {
    public static void main(String[] args) {
        int port = 80;
        if(args.length>0) port = Integer.parseInt(args[0]);
        long num = 0;
        try {
            ServerSocket serverSocket = new ServerSocket(port);
            while (true) {
                try {
                    Socket socket = serverSocket.accept();
                    num++;
                    if (num % 2 == 0) {
                        System.out.println(num/2 + "" + socket.getRemoteSocketAddress());
                    }
                    Thread socketThread = new SocketThread(socket);
                    socketThread.start();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
class SocketThread extends Thread {
    final Socket socket;

    public SocketThread(Socket socket) {
        this.socket = socket;
    }

    @Override
    public void run() {
        try (InputStream inputStream = socket.getInputStream()) {
            byte[] buffer = new byte[2048];
            inputStream.read(buffer);
            String data = "IP:"+socket.getRemoteSocketAddress()+"<br>"+new String(buffer).replace("\n", "<br>");
            try (OutputStream output = socket.getOutputStream()) {
                output.write("HTTP/1.1 200 OK\r\n".getBytes());
                output.write("Content-Type: text/html\r\n".getBytes());
                output.write(("Content-Length: " + data.length() + "\r\n").getBytes());
                output.write("\r\n".getBytes());
                output.write(data.getBytes());
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                socket.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
