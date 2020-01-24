package com.kimitzu.dev;

import android.Manifest;
import android.content.DialogInterface;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;

import androidx.appcompat.app.AlertDialog;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import mobile.Node;
import mobile.NodeConfig;
import mobile.Services;
import java.io.File;
import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
    private static final int STORAGE_PERMISSIONS_CODE = 200;
    private Node node;
    private NodeConfig nodeConfig;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Initializes the Bridge
        this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
            // Additional plugins you've installed go here
            // Ex: add(TotallyAwesomePlugin.class);
        }});
    }

    public void onStart() {
        super.onStart();
        boolean hasPermissions = this.hasPermissions();
        if (!hasPermissions) {
            this.requestPermissions();
        } else {
            startKimitzuServers(false);
        }
    }

    public String createFolder(String name) {
        String folderPath = Environment.getExternalStorageDirectory().toString() + "/" + name;
        File folder = new File(folderPath);
        if (!folder.exists()) {
            folder.mkdir();
        }
        return folderPath;
    }

    private boolean hasPermissions() {
        int writePermission = ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.WRITE_EXTERNAL_STORAGE);
        int readPermission= ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.READ_EXTERNAL_STORAGE);
        return writePermission == PackageManager.PERMISSION_GRANTED && readPermission == PackageManager.PERMISSION_GRANTED;
    }

    private void requestPermissions() {
        ActivityCompat.requestPermissions(MainActivity.this, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.READ_EXTERNAL_STORAGE}, STORAGE_PERMISSIONS_CODE);
    }

    private void startKimitzuServers(boolean isTestnet) {
        String kimitzuServices = "kimitzu";
        String openbazaar = "kimitzu-ob";
        if (isTestnet) {
            kimitzuServices += "-testnet";
            openbazaar += "-testnet";
        }
        String kimitzuPath = createFolder(kimitzuServices);
        String obPath = createFolder(openbazaar);
        nodeConfig = new NodeConfig();
        nodeConfig.setTestnet(isTestnet);
        nodeConfig.setRepoPath(obPath);
        node = new Node(nodeConfig, "", "");

        Services services = new Services(kimitzuPath, isTestnet, 5);
        try {
//            Toast.makeText(this, "Starting OpenBazaar server...", Toast.LENGTH_LONG).show();
            node.start();
            services.start();
        } catch (Exception e) {
            Log.e("serverError", e.toString());
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        switch (requestCode) {
            case STORAGE_PERMISSIONS_CODE: {
                if (grantResults.length > 0) {
                    boolean hasWriteAccepted = grantResults[0] == PackageManager.PERMISSION_GRANTED;
                    boolean hasReadAccepted = grantResults[1] == PackageManager.PERMISSION_GRANTED;
                    if (!hasReadAccepted || !hasWriteAccepted) {
                        AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this);
                        builder.setTitle("Enable storage access");
                        builder.setMessage("Kimitzu needs to access storage in order to setup and run local server.");
                        builder.setPositiveButton(R.string.ok, new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {
                                requestPermissions();
                            }
                        });
                        builder.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {
                                finish();
                            }
                        });
                        AlertDialog dialog = builder.create();
                        dialog.show();
                    } else {
                        startKimitzuServers(false);
                    }
                }
            }
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        try {
            node.stop();
        } catch (Exception e) {
            Log.e("Server error", e.getMessage());
        }
    }
}
