using System;
using System.IO;
using System.Collections.Generic;
using Tobii.Interaction;
using Quobject.SocketIoClientDotNet.Client;


namespace Interaction_Streams_101
{
    public class Program
    {
        static bool isRecording = false;
        static List<string> buffer = new List<string>();
        static string log_file_name = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments) + @"\New_eye_tracking_log.txt";
        static Socket socket;
        
        public static void Main(string[] args)
        {
            // Everything starts with initializing Host, which manages connection to the 
            // Tobii Engine and provides all the Tobii Core SDK functionality.
            // NOTE: Make sure that Tobii.EyeX.exe is running
            var host = new Host();
            Console.WriteLine("Save into {0}", log_file_name);
            socket = IO.Socket("http://localhost:5000/");
            socket.On("newconnection", (data) =>
            {
                if (data.Equals("received"))
                {
                    socket.Emit("eyetracker", "ready");
                }
            });
            // 2. Create stream. 

            var fixationDataStream = host.Streams.CreateFixationDataStream(Tobii.Interaction.Framework.FixationDataMode.Sensitive);
            fixationDataStream.Begin((x, y, ts) => changePos(x, y, ts));
            fixationDataStream.Data((x, y, ts) => SendFilteredValue(x, y));
            fixationDataStream.End((x, y, ts) => changePos(x, y, ts));

            while (true)
            {
                ConsoleKey key = Console.ReadKey().Key;
                if (key == System.ConsoleKey.Escape)
                    break;
                Program.isRecording = !Program.isRecording;
                if(!Program.isRecording)
                { 
                    // write buffer to file and clear buffer
                    using (StreamWriter outputFile = new StreamWriter(log_file_name, true))
                    {
                        string[] lines = buffer.ToArray();
                        foreach (string line in lines)
                            outputFile.WriteLine(line);
                        outputFile.Write("@"); // write an specfic symbol to separate the time block
                        Console.WriteLine(" write {0} lines to file.", buffer.Count);
                        outputFile.WriteLine("");
                        buffer.Clear();
                    }
                }
            }

            // we will close the coonection to the Tobii Engine before exit.
            host.DisableConnection();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <param name="ts"></param>
        /// 

        private static void changePos(double x, double y, double timestamp)
        {
            //XData = x;
            //YData = y;
            //socket.Emit("eyemove", XData, YData);
            if (!Program.isRecording)
                return;
            var XData = x;
            var YData = y;
            //Console.WriteLine("RAW Timestamp: {0}\t X: {1} Y:{2}", timestamp, XData, YData);
            //SendFilteredValue(x, y);
            Console.WriteLine("Timestamp: {0}\t X: {1} Y:{2}", timestamp, XData, YData);
        }

        private static void SendFilteredValue(double x, double y)
        {
            var XData = x;
            var YData = y;
            if (XData == double.NaN || YData == double.NaN)
                return;
            //XData = oneEuroFilterX.Filter(x, 30);
            //YData = oneEuroFilterY.Filter(y, 30);
            socket.Emit("eyemoved", Convert.ToInt32(XData), Convert.ToInt32(YData));
        }

        public static void Write(double x, double y, double ts)
        {
            if (Program.isRecording)
            {
                Console.WriteLine("Timestamp: {0}\t X: {1} Y:{2}", ts, x, y);
                buffer.Add(string.Format("Timestamp: {0} X: {1} Y:{2}", ts, x, y));
            }
        }

    }
}